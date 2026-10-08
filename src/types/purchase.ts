import { BaseApiResponse } from "./api";
import { InventoryItemOptions } from "./inventoryItem";
import { DefaultFilter } from "./table";

export interface PurchaseFilterPayload extends DefaultFilter {
  search?: string;
}

interface InventoryLot {
  id: string;
  quantity: number;
  remainingQuantity: number;
  unitCost: number;
  receivedAt: string;
  expiredAt: string;
}

interface PurchaseItem {
  id: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  inventoryItem: InventoryItemOptions;
  inventoryLot: InventoryLot;
}

export interface PurchaseResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  supplierName: string;
  invoiceNumber: string;
  purchasedAt: string;
  purchaseItems: PurchaseItem[];
}
