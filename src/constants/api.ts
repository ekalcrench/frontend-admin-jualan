export const api = {
  auth: {
    register: "/auth/register",
    registerVerify: "/auth/register/verify",
    resendOtp: "/auth/resend-otp",
  },
};

export const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
