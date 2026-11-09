export interface EditInventoryLot {
  id: string;
  remainingQuantity?: number;
  receivedAt?: string;
  expiredAt?: string | null;
}
