import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface OrderFilterPayload extends DefaultFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
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
