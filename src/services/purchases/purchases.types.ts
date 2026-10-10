export interface CreatePurchaseItem {
  inventoryItemId: string;
  quantity: number;
  totalCost: number;
  receivedAt: string;
  expiredAt?: string;
}

export interface CreatePurchase {
  supplierName: string;
  invoiceNumber: string;
  purchasedAt: string;
  purchaseItems: CreatePurchaseItem[];
}

export type EditPurchaseItem =
  | (Partial<CreatePurchaseItem> & {
      id: string;
      inventoryLotId: string;
    })
  | CreatePurchaseItem;

export interface EditPurchase extends Partial<
  Omit<CreatePurchase, "purchaseItems">
> {
  id: string;
  purchaseItems?: EditPurchaseItem[];
}
