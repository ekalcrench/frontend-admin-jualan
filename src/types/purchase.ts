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
  totalCost: number;
  receivedAt: string;
  expiredAt: string;
}

interface PurchaseItem {
  id: string;
  inventoryItemId: string;
  quantity: number;
  packageSize: number;
  totalCost: number;
  inventoryItem: InventoryItemOptions;
  inventoryLot: InventoryLot;
}

export type PurchaseStatus = "DRAFT" | "FINALIZED";

export interface PurchaseResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  supplierName: string;
  invoiceNumber: string;
  status: PurchaseStatus;
  purchasedAt: string;
  purchaseItems: PurchaseItem[];
}
