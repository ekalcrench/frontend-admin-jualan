import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface InventoryLotsResponse extends BaseApiResponse {
  id: string;
  inventoryItemId: string;
  purchaseItemId: string;
  invoiceNumber: string;
  supplierName: string;
  quantity: number;
  remainingQuantity: number;
  unitCost: number;
  totalCost: number;
  receivedAt: string;
  expiredAt?: string;
}

export interface InventoryLotFilterPayload extends DefaultFilter {
  inventoryItemId: string;
  search?: string;
}
