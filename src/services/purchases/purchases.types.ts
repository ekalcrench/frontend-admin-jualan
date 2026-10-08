import { BaseApiResponse } from "@/types/api";
import { InventoryItemOptions } from "@/types/inventoryItem";

export interface CreatePurchaseItem {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  receivedAt: string;
  expiredAt?: string;
}

export interface CreatePurchase {
  supplierName: string;
  invoiceNumber: string;
  purchasedAt: string;
  purchaseItems: CreatePurchaseItem[];
}

export interface EditPurchase extends Partial<CreatePurchase> {
  id: string;
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
