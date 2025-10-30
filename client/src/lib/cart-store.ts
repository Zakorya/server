import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@shared/schema';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, qty: 1 }] };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
      })),
      
      updateQuantity: (id, qty) => set((state) => ({
        items: state.items.map(i =>
          i.id === id ? { ...i, qty: Math.max(1, qty) } : i
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.qty, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
