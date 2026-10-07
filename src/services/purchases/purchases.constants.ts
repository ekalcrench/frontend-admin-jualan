import { PurchaseFilterPayload } from "@/types/purchase";

export const purchasesKeys = {
  all: ["purchases"] as const,

  lists: () => ["purchases", "list"] as const,
  list: (params: PurchaseFilterPayload) =>
    ["purchases", "list", params] as const,

  details: () => ["purchases", "detail"] as const,
  detail: (id?: string) => ["purchases", "detail", id] as const,
};
