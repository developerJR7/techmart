"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Check } from "lucide-react";
import { addressesService, Address, CreateAddressDto } from "@/services/addresses.service";

const EMPTY_FORM: CreateAddressDto = {
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    complement: '',
};

const formatZipCode = (value: string) =>
    value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

interface AddressSelectorProps {
    // Chamado sempre que a seleção muda — inclusive com `null` enquanto
    // nada está selecionado ainda (lista carregando, vazia, ou usuário no
    // meio do formulário de endereço novo). O checkout deve bloquear o
    // envio do pedido enquanto isso for `null`.
    onAddressSelected: (addressId: string | null) => void;
}

// Compartilhado pelas 3 páginas de checkout (pix/boleto/credit_card): lista
// os endereços salvos do usuário e deixa escolher um, ou cadastrar um novo
// — em vez de cada página coletar o endereço num formulário solto que nunca
// virava um Address de verdade no backend.
export function AddressSelector({ onAddressSelected }: AddressSelectorProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CreateAddressDto>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        addressesService.findAll()
            .then((data) => {
                if (cancelled) return;
                setAddresses(data);
                const defaultAddress = data.find(a => a.isDefault) ?? data[0];
                if (defaultAddress) {
                    setSelectedId(defaultAddress.id);
                    onAddressSelected(defaultAddress.id);
                } else {
                    setShowForm(true);
                }
            })
            .catch(() => {
                if (!cancelled) setShowForm(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectAddress = (id: string) => {
        setSelectedId(id);
        setShowForm(false);
        onAddressSelected(id);
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const created = await addressesService.create(form);
            setAddresses((prev) => [...prev, created]);
            setForm(EMPTY_FORM);
            selectAddress(created.id);
        } catch {
            setError('Não foi possível salvar o endereço. Verifique os dados e tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} /> Endereço de Entrega
                </h2>
                <p style={{ fontSize: '14px', color: '#565959' }}>Carregando endereços...</p>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} /> Endereço de Entrega
            </h2>

            {addresses.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            onClick={() => selectAddress(address.id)}
                            style={{
                                border: selectedId === address.id ? '2px solid #FF9900' : '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                backgroundColor: selectedId === address.id ? '#fff8f0' : '#fff',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                    {address.street}, {address.number}
                                    {address.complement ? ` - ${address.complement}` : ''}
                                    {address.isDefault && (
                                        <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 'normal', color: '#007600' }}>
                                            (padrão)
                                        </span>
                                    )}
                                </p>
                                <p style={{ fontSize: '13px', color: '#565959' }}>
                                    {address.neighborhood} - {address.city}/{address.state} - CEP {address.zipCode}
                                </p>
                            </div>
                            {selectedId === address.id && <Check size={20} color="#FF9900" />}
                        </div>
                    ))}

                    {!showForm && (
                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: 'none', color: '#007185',
                                cursor: 'pointer', fontSize: '14px', padding: '4px 0',
                            }}
                        >
                            <Plus size={16} /> Usar outro endereço
                        </button>
                    )}
                </div>
            )}

            {showForm && (
                <div>
                    {error && (
                        <p style={{ fontSize: '13px', color: '#B12704', marginBottom: '10px' }}>{error}</p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>CEP</label>
                            <input
                                type="text"
                                value={form.zipCode}
                                onChange={(e) => setForm({ ...form, zipCode: formatZipCode(e.target.value) })}
                                placeholder="00000-000"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Estado (UF)</label>
                            <input
                                type="text"
                                value={form.state}
                                onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase().slice(0, 2) })}
                                placeholder="SP"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Cidade</label>
                        <input
                            type="text"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Rua</label>
                            <input
                                type="text"
                                value={form.street}
                                onChange={(e) => setForm({ ...form, street: e.target.value })}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Número</label>
                            <input
                                type="text"
                                value={form.number}
                                onChange={(e) => setForm({ ...form, number: e.target.value })}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Bairro</label>
                            <input
                                type="text"
                                value={form.neighborhood}
                                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Complemento</label>
                            <input
                                type="text"
                                value={form.complement}
                                onChange={(e) => setForm({ ...form, complement: e.target.value })}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={handleSaveAddress}
                            disabled={saving}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: saving ? '#ddd' : '#0066c0',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            {saving ? 'Salvando...' : 'Salvar endereço'}
                        </button>
                        {addresses.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#fff',
                                    color: '#565959',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
