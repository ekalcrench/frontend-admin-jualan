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

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
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
  inventoryItem: InventoryItem;
  inventoryLot: InventoryLot;
}

export interface PurchaseResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  organizationId: string;
  supplierName: string;
  invoiceNumber: string;
  purchasedAt: string;
  purchaseItems: PurchaseItem[];
}
