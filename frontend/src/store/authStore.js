import { create } from 'zustand';

// There is no token here: the session lives in an httpOnly cookie that
// JavaScript cannot read. The server stays the source of truth
// (GET /api/session); this store only mirrors its answer.
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
