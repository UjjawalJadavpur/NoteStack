import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  id: null,
  name: null,
  email: null,
  setToken: (token) => set({ token }),
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  reset: () => set({ token: null, id: null, name: null, email: null }),
}));
