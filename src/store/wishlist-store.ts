import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    slug: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
    getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items;
                const exists = items.find((i) => i.id === item.id);

                if (!exists) {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            isInWishlist: (id) => {
                return get().items.some((item) => item.id === id);
            },
            clearWishlist: () => {
                set({ items: [] });
            },
            getItemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
