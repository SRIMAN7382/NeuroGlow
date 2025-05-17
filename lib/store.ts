import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './types';

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        set({
          cart: get().cart.map(item =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      addToWishlist: (product) => {
        const wishlist = get().wishlist;
        if (!wishlist.find(item => item.id === product.id)) {
          set({ wishlist: [...wishlist, product] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter(item => item.id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().wishlist.some(item => item.id === productId);
      },
    }),
    {
      name: 'glow-store',
    }
  )
);