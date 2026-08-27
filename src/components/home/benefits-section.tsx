import { CreditCard, ShieldCheck, Bot, Truck } from "lucide-react";

// Cada item aqui corresponde a uma funcionalidade real do backend — nada de
// prazo de entrega, garantia ou selo que o sistema não sustenta de verdade.
const benefits = [
  {
    icon: ShieldCheck,
    title: "Vendedores aprovados",
    description: "Todo vendedor passa por um processo de aprovação antes de vender no TechMart.",
  },
  {
    icon: CreditCard,
    title: "Pagamento seguro",
    description: "Cartão, Pix ou boleto, processados com a mesma infraestrutura de pagamento.",
  },
  {
    icon: Truck,
    title: "Frete transparente",
    description: "Frete grátis acima de R$ 200 — o valor exato aparece antes de fechar a compra.",
  },
  {
    icon: Bot,
    title: "Atendimento com IA",
    description: "Assistente disponível a qualquer momento pra tirar dúvidas sobre produtos e pedidos.",
  },
];

export function BenefitsSection() {
  return (
    <section aria-labelledby="section-beneficios">
      <h2 id="section-beneficios" className="sr-only">
        Por que comprar no TechMart
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5"
          >
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="font-medium text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
