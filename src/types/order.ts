import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface OrderFilterPayload extends DefaultFilter {
  search?: string;
}

interface OrderItems {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string };
}

export type OrderStatus = "PAID" | "UNPAID";

export interface OrderResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  orderItems: OrderItems[];
}
