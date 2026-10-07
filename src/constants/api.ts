export const api = {
  auth: {
    login: "/auth/login",
    loginOrganization: "/auth/login/organization",
    register: "/auth/register",
    registerVerify: "/auth/register/verify",
    resendOtp: "/auth/resend-otp",
  },
  users: {
    base: "/users",
    byId: (id: string) => `/users/${id}`,
    activate: (id: string) => `/users/${id}/activate`,
    suspend: (id: string) => `/users/${id}/suspend`,
    organizations: (id: string) => `/users/${id}/organizations`,
    options: "/users/options",
  },
  organizations: {
    base: "/organizations",
    byId: (id: string) => `/organizations/${id}`,
  },
  organizationUsers: {
    base: "/organization-users",
    byId: (id: string) => `/organization-users/${id}`,
    approve: (id: string) => `/organization-users/${id}/approve`,
    suspend: (id: string) => `/organization-users/${id}/suspend`,
    activate: (id: string) => `/organization-users/${id}/activate`,
  },
  inventoryItems: {
    base: "/inventory-items",
    byId: (id: string) => `/inventory-items/${id}`,
    options: "/inventory-items/options",
  },
  purchases: {
    base: "/purchases",
    byId: (id: string) => `/purchases/${id}`,
  },
};

export const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
export const storageBaseUrl = import.meta.env.VITE_API_STORAGE_BASE_URL;
