export const api = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    registerVerify: "/auth/register/verify",
    resendOtp: "/auth/resend-otp",
  },
  users: {
    base: "/users",
    byId: (id: string) => `/users/${id}`,
    activate: (id: string) => `/users/${id}/activate`,
    suspend: (id: string) => `/users/${id}/suspend`,
  },
  organizations: {
    base: "/organizations",
    byId: (id: string) => `/organizations/${id}`,
  },
};

export const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
export const storageBaseUrl = import.meta.env.VITE_API_STORAGE_BASE_URL;
