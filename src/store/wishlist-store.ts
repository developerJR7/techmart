import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistService } from '@/services/wishlist.service';
import { getAccessToken } from '@/lib/auth-token';

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    slug: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
    syncWithBackend: () => Promise<void>;
    getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: async (item) => {
                const items = get().items;
                const exists = items.find((i) => i.id === item.id);

                if (!exists) {
                    set({ items: [...items, item] });

                    if (getAccessToken()) {
                        try {
                            await wishlistService.addToWishlist(item.id);
                        } catch (error) {
                            console.error('Erro ao adicionar à wishlist remota:', error);
                        }
                    }
                }
            },

            removeItem: async (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });

                if (getAccessToken()) {
                    try {
                        await wishlistService.removeFromWishlist(id);
                    } catch (error) {
                        console.error('Erro ao remover da wishlist remota:', error);
                    }
                }
            },

            isInWishlist: (id) => {
                return get().items.some((item) => item.id === id);
            },

            clearWishlist: () => {
                set({ items: [] });
            },

            syncWithBackend: async () => {
                if (!getAccessToken()) return;

                try {
                    // Sync local items to backend
                    const localItems = get().items;
                    if (localItems.length > 0) {
                        await wishlistService.syncWishlist(localItems.map(i => i.id));
                    }

                    // Fetch updated wishlist
                    const remoteWishlist = await wishlistService.getWishlist();

                    // Map to local structure
                    const mappedItems: WishlistItem[] = remoteWishlist.map((product: any) => ({
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        image: product.images?.[0],
                        slug: product.slug
                    }));

                    set({ items: mappedItems });
                } catch (error) {
                    console.error('Erro ao sincronizar wishlist:', error);
                }
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
