import { InventoryTransactionFilterPayload } from "@/types/inventoryTransaction";

export const inventoryTransactionKeys = {
  all: ["inventory_transactions"] as const,

  lists: () => ["inventory_transactions", "list"] as const,
  list: (params: InventoryTransactionFilterPayload) =>
    ["inventory_transactions", "list", params] as const,
};
