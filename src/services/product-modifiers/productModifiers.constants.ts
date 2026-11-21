import { ProductModifierGroupFilterPayload } from "@/types/productModifier";

export const productModifierKeys = {
  all: ["product-modifier-groups"] as const,

  lists: ["product-modifier-groups", "list"] as const,
  list: (params: ProductModifierGroupFilterPayload) =>
    ["product-modifier-groups", "list", params] as const,

  details: ["product-modifier-groups", "detail"] as const,
  detail: (id?: string) => ["product-modifier-groups", "detail", id] as const,

  assignments: ["product-modifier-groups", "assignments"] as const,
  assignment: (productId?: string, activeOnly = false) =>
    ["product-modifier-groups", "assignments", productId, activeOnly] as const,
};
