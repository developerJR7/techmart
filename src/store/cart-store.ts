import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '@/services/cart.service';
import { couponsService } from '@/services/coupons.service';
import { getAccessToken } from '@/lib/auth-token';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  syncWithBackend: () => Promise<void>;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: async (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        const quantityToAdd = item.quantity || 1;

        // Optimistic update
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: quantityToAdd }] });
        }

        if (getAccessToken()) {
          try {
            await cartService.addToCart(item.id, quantityToAdd);
          } catch (error) {
            console.error('Erro ao adicionar ao carrinho remoto:', error);
          }
        }
      },

      removeItem: async (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });

        if (getAccessToken()) {
          try {
            await cartService.removeFromCart(id);
          } catch (error) {
            console.error('Erro ao remover do carrinho remoto:', error);
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });

        if (getAccessToken()) {
          try {
            await cartService.updateCartItem(id, quantity);
          } catch (error) {
            console.error('Erro ao atualizar quantidade remota:', error);
          }
        }
      },

      clearCart: async () => {
        set({ items: [], couponCode: null, discount: 0 });
        if (getAccessToken()) {
          try {
            await cartService.clearCart();
          } catch (error) {
            console.error('Erro ao limpar carrinho remoto:', error);
          }
        }
      },

      syncWithBackend: async () => {
        if (!getAccessToken()) return;

        try {
          // First, sync local items to backend
          const localItems = get().items;
          if (localItems.length > 0) {
            await cartService.syncCart(localItems.map(i => ({ productId: i.id, quantity: i.quantity })));
          }

          // Then fetch the updated cart from backend
          const remoteCart = await cartService.getCart();

          // Map remote cart to local structure
          const mappedItems: CartItem[] = remoteCart.map((item: any) => ({
            id: item.productId || item.product?.id,
            name: item.product?.name || 'Produto',
            price: Number(item.product?.price) || 0,
            image: item.product?.images?.[0],
            quantity: item.quantity,
            slug: item.product?.slug || ''
          })).filter(item => item.id); // Ensure valid items

          set({ items: mappedItems });
        } catch (error) {
          console.error('Erro ao sincronizar carrinho:', error);
        }
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discount;
        return Math.max(0, subtotal - discount);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      applyCoupon: async (code: string) => {
        try {
          const coupon = await couponsService.validateCoupon(code);

          if (coupon && coupon.isActive) {
            let discountValue = 0;
            const subtotal = get().getSubtotal();

            if (coupon.type === 'PERCENTAGE') {
              discountValue = subtotal * (coupon.value / 100);
            } else if (coupon.type === 'FIXED') {
              discountValue = coupon.value;
            } else if (coupon.type === 'FREE_SHIPPING') {
              // Handle free shipping separately if needed, for now just 0 discount on product price
              // Or we can set a flag for free shipping
              discountValue = 0;
            }

            set({ couponCode: code, discount: discountValue });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Erro ao validar cupom:', error);
          return false;
        }
      },

      removeCoupon: () => {
        set({ couponCode: null, discount: 0 });
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

