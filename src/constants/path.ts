export const paths = {
  base: "/",
  login: "/login",
  register: "/register",
  registerVerify: "/register/verify",
  selectOrganizations: "/select-organizations",

  dashboard: "/dashboard",
  analytics: "/analytics",
  announcements: "/announcements",
  sales: "/sales",
  cashFlows: "/cash-flows",

  products: "/products",
  users: "/users",
  inventoryItems: "/inventory-items",
  inventoryItemsDetail: (id: string) => `/inventory-items/${id}`,
  inventoryItemsDetailRoute: "/inventory-items/:inventoryItemId",
  inventoryProductions: "/inventory-productions",
  inventoryTransactions: "/inventory-transactions",
  purchases: "/purchases",

  allUsers: "/all-users",
  umkm: "/umkm",
};
