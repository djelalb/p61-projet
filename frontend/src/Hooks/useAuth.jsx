import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set((state) => ({ ...state, user })),
      setToken: (token) => set((state) => ({ ...state, token })),
    }),
    {
      name: 'auth-store',
    },
  ),
);
