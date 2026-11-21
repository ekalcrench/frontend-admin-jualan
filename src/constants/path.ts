export const paths = {
  base: "/",
  login: "/login",
  register: "/register",
  registerVerify: "/register/verify",
  selectOrganizations: "/select-organizations",

  dashboard: "/dashboard",
  sales: "/sales",
  purchases: "/purchases",
  cashFlows: "/cash-flows",

  products: "/products",
  productModifiers: "/product-modifiers",
  productModifierDetail: (id: string) => `/product-modifiers/${id}`,
  productModifierDetailRoute: "/product-modifiers/:modifierGroupId",
  inventoryItems: "/inventory-items",
  inventoryItemsDetail: (id: string) => `/inventory-items/${id}`,
  inventoryItemsDetailRoute: "/inventory-items/:inventoryItemId",
  inventoryProductions: "/inventory-productions",
  inventoryTransactions: "/inventory-transactions",
  users: "/users",

  allUsers: "/all-users",
  umkm: "/umkm",
};
