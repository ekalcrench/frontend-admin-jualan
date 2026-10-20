import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface InventoryLotsResponse extends BaseApiResponse {
  id: string;
  inventoryItemId: string;
  purchaseItemId: string | null;
  preparationOutputId: string | null;
  invoiceNumber: string | null;
  supplierName: string | null;
  preparationName: string | null;
  quantity: number;
  remainingQuantity: number;
  unitCost: number;
  totalCost: number;
  receivedAt: string;
  expiredAt: string | null;
}

export interface InventoryLotFilterPayload extends DefaultFilter {
  inventoryItemId: string;
  search?: string;
}
