import { OrderFilterPayload } from "@/types/order";

export const ordersKeys = {
  all: ["orders"] as const,

  lists: ["orders", "list"] as const,
  list: (params: OrderFilterPayload) => ["orders", "list", params] as const,

  details: ["orders", "detail"] as const,
  detail: (id?: string) => ["orders", "detail", id] as const,
};
