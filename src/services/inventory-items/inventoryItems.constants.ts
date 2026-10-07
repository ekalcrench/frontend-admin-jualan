import { InventoryItemFilterPayload } from "@/types/inventoryItem";

export const inventoryItemKeys = {
  all: ["inventory_items"] as const,

  lists: () => ["inventory_items", "list"] as const,
  list: (params: InventoryItemFilterPayload) =>
    ["inventory_items", "list", params] as const,

  details: () => ["inventory_items", "detail"] as const,
  detail: (id?: string) => ["inventory_items", "detail", id] as const,

  options: (search: string) => ["inventory_items", "options", search] as const,
};
