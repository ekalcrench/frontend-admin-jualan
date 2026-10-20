import { ProductFilterPayload } from "@/types/product";

export const productsKeys = {
  all: ["products"] as const,

  lists: ["products", "list"] as const,
  list: (params: ProductFilterPayload) => ["products", "list", params] as const,

  details: ["products", "detail"] as const,
  detail: (id?: string) => ["products", "detail", id] as const,

  options: ["products", "options"] as const,
};
