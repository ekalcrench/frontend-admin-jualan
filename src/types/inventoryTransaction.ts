import { BaseApiResponse } from "./api";
import { InventoryUnit } from "./inventoryItem";
import { DefaultFilter } from "./table";

export type InventoryTransactionType =
  | "PURCHASE"
  | "SALE"
  | "PREPARATION_IN"
  | "PREPARATION_OUT"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  | "WASTE"
  | "RETURN";

export interface InventoryTransactionResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  inventoryItemId: string;
  type: InventoryTransactionType;
  quantity: number;
  inventoryItem: { name: string; unit: InventoryUnit };
  referenceId?: string;
}

export interface InventoryTransactionFilterPayload extends DefaultFilter {
  search?: string;
}
