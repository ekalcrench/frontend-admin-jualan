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
