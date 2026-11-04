import { OrderFilterPayload, OrderOverviewParams } from "@/types/order";

export const ordersKeys = {
  all: ["orders"] as const,

  lists: ["orders", "list"] as const,
  list: (params: OrderFilterPayload) => ["orders", "list", params] as const,

  details: ["orders", "detail"] as const,
  detail: (id?: string) => ["orders", "detail", id] as const,

  overviews: ["orders", "overviews"] as const,
  overview: (params: OrderOverviewParams) =>
    ["orders", "overviews", params] as const,

  overviewItems: ["orders", "overview-items"] as const,
  overviewItem: (params: OrderOverviewParams) =>
    ["orders", "overview-items", params] as const,
};
