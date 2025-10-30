import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer } from '@shared/schema';

interface AuthStore {
  customer: Customer | null;
  isAdmin: boolean;
  setCustomer: (customer: Customer | null) => void;
  setAdmin: (isAdmin: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      customer: null,
      isAdmin: false,
      
      setCustomer: (customer) => set({ customer, isAdmin: false }),
      setAdmin: (isAdmin) => set({ isAdmin, customer: null }),
      logout: () => set({ customer: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
