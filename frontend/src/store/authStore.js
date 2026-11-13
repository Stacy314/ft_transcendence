import { create } from 'zustand';

// Client-side copy of who is logged in, for quick access in any component:
//   const user = useAuthStore((s) => s.user);
//
// There is no token here: the session lives in an httpOnly cookie that
// JavaScript cannot read. The server stays the source of truth
// (GET /api/session); this store only mirrors its answer.
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
