export const paths = {
  base: "/",
  login: "/login",
  register: "/register",
  registerVerify: "/register/verify",
  selectOrganizations: "/select-organizations",

  dashboard: "/dashboard",
  analytics: "/analytics",
  sales: "/sales",

  users: "/users",
  inventoryItems: "/inventory-items",
  inventoryItemsDetail: (id: string) => `/inventory-items/${id}`,
  inventoryItemsDetailRoute: "/inventory-items/:inventoryItemId",
  inventoryTransactions: "/inventory-transactions",
  purchases: "/purchases",

  allUsers: "/all-users",
  umkm: "/umkm",
};
