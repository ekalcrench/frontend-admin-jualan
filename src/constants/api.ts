export const api = {
  auth: {
    login: "/auth/login",
    loginOrganization: "/auth/login/organization",
    logout: "/auth/logout",
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
    assets: "/inventory-items/assets",
  },
  inventoryLots: {
    base: "/inventory-lots",
    byId: (id: string) => `/inventory-lots/${id}`,
  },
  purchases: {
    base: "/purchases",
    byId: (id: string) => `/purchases/${id}`,
    finalize: (id: string) => `/purchases/${id}/finalize`,
  },
  preparations: {
    base: "/preparations",
    byId: (id: string) => `/preparations/${id}`,
    complete: (id: string) => `/preparations/${id}/complete`,
  },
  products: {
    base: "/products",
    byId: (id: string) => `/products/${id}`,
    options: "/products/options",
    lowestStocks: "/products/lowest-stocks",
  },
  productModifierGroups: {
    base: "/product-modifier-groups",
    byId: (id: string) => `/product-modifier-groups/${id}`,
    status: (id: string) => `/product-modifier-groups/${id}/status`,
    options: (id: string) => `/product-modifier-groups/${id}/options`,
    reorderOptions: (id: string) =>
      `/product-modifier-groups/${id}/options/reorder`,
  },
  productModifierOptions: {
    base: "/product-modifier-options",
    byId: (id: string) => `/product-modifier-options/${id}`,
    status: (id: string) => `/product-modifier-options/${id}/status`,
  },
  productModifierAssignments: {
    base: (productId: string) =>
      `/products/${productId}/modifier-groups`,
    byId: (productId: string, modifierGroupId: string) =>
      `/products/${productId}/modifier-groups/${modifierGroupId}`,
    reorder: (productId: string) =>
      `/products/${productId}/modifier-groups/reorder`,
  },
  orders: {
    base: "/orders",
    byId: (id: string) => `/orders/${id}`,
    markPaid: (id: string) => `/orders/${id}/mark-paid`,
    overview: "/orders/overview",
    overviewItems: "/orders/overview-items",
  },
  inventoryTransactions: {
    base: "/inventory-transactions",
  },
  cashTransactions: {
    base: "/cash-transactions",
    byId: (id: string) => `/cash-transactions/${id}`,
    balance: "/cash-transactions/balance",
    cashFlow: "/cash-transactions/cash-flow",
  },
};

export const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
