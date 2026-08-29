import { create } from "zustand";
import { AuthState } from "./authStore.types";

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email) => {
    set({ isAuthenticated: true, user: { name: "Admin", email } });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
