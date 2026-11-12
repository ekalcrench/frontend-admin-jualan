import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface EditInventoryLot {
  id: string;
  remainingQuantity?: number;
  receivedAt?: string;
  expiredAt?: string | null;
}

export interface InventoryLotResponse extends BaseApiResponse {
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
