import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "./authStore.types";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      login: async (user, accessToken) => {
        set({ accessToken, user });
      },
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "admin-jualan-auth",
    },
  ),
);

export default useAuthStore;
