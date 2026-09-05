import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "./authStore.types";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      organization: null,
      login: (user, accessToken) => set({ accessToken, user }),
      loginOrganization: (organization) => set({ organization }),
      logout: () => set({ accessToken: null, user: null, organization: null }),
    }),
    {
      name: "admin-jualan-auth",
    },
  ),
);

export default useAuthStore;
