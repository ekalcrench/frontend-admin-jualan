import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface OrderFilterPayload extends DefaultFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
}

export type OrderStatus = "PAID" | "UNPAID";

export interface CreateOrderItems {
  productId: string;
  quantity: number;
}

export interface CreateOrder {
  orderNumber: string;
  orderItems: CreateOrderItems[];
}

export type EditOrderItems =
  | (Partial<CreateOrderItems> & {
      id: string;
    })
  | CreateOrderItems;

export interface EditOrder extends Partial<Omit<CreateOrder, "orderItems">> {
  id: string;
  orderItems?: EditOrderItems[];
  deletedOrderItemIds?: string[];
}

interface OrderItems {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string };
}

export interface OrderResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  status: OrderStatus;
  orderItems: OrderItems[];
}

export interface OrderOverviewParams {
  startDate?: string;
  endDate?: string;
}

export interface OrderOverviewResponse {
  totalAmount: number;
  totalQuantity: number;
  totalGrossProfit: number;
  prevTotalAmount: number;
  prevTotalQuantity: number;
  prevTotalGrossProfit: number;
}

export interface OrderOverviewItemsResponse {
  mostSellItemsAmount: number;
  mostSellItemsName: string;
  mostSellItemsLatestSold: string;
  leastSellItemsAmount: number;
  leastSellItemsName: string;
  leastSellItemsLatestSold: string;
}
