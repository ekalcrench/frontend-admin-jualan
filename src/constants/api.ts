export const api = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    registerVerify: "/auth/register/verify",
    resendOtp: "/auth/resend-otp",
  },
};

export const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
