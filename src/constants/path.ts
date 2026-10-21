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
  purchases: "/purchases",
  cashFlows: "/cash-flows",

  products: "/products",
  inventoryItems: "/inventory-items",
  inventoryItemsDetail: (id: string) => `/inventory-items/${id}`,
  inventoryItemsDetailRoute: "/inventory-items/:inventoryItemId",
  inventoryProductions: "/inventory-productions",
  inventoryTransactions: "/inventory-transactions",
  users: "/users",

  allUsers: "/all-users",
  umkm: "/umkm",
};
