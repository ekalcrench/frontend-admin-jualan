import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email) => {
    set({ isAuthenticated: true, user: { name: "Admin", email } });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
