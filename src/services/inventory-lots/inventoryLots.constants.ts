import { InventoryLotFilterPayload } from "@/types/inventoryLot";

export const inventoryLotKeys = {
  all: ["inventory_lots"] as const,

  lists: () => ["inventory_lots", "list"] as const,
  list: (params: InventoryLotFilterPayload) =>
    ["inventory_lots", "list", params] as const,
};
