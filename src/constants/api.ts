export const api = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    registerVerify: "/auth/register/verify",
    resendOtp: "/auth/resend-otp",
  },
  users: {
    base: "/users",
  },
  organizations: {
    base: "/organizations",
  },
};

export const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
export const storageBaseUrl = import.meta.env.VITE_API_STORAGE_BASE_URL;
