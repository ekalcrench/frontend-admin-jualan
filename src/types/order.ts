import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export type OrderStatus = "PAID" | "UNPAID";

export type OrderType = "DELIVERY" | "TAKEAWAY" | "DINE_IN";

export interface OrderFilterPayload extends DefaultFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateDeliveryOrder {
  deliveryFee: number;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export interface CreateTakeawayOrder {
  name: string;
  phone?: string;
  pickUpTime: string;
}

export interface CreateDineInOrder {
  tableId: string;
  name?: string;
  guestCount: number;
}

export interface CreateOrderItems {
  productId: string;
  quantity: number;
}

export interface CreateOrder {
  type: OrderType;
  orderNumber: string;
  customerId?: string;
  deliveryOrder?: CreateDeliveryOrder;
  takeawayOrder?: CreateTakeawayOrder;
  dineInOrder?: CreateDineInOrder;
  orderItems: CreateOrderItems[];
}

export type EditDeliveryOrder = Partial<CreateDeliveryOrder>;

export type EditTakeawayOrder = Partial<CreateTakeawayOrder>;

export type EditDineInOrder = Partial<CreateDineInOrder>;

export type EditOrderItems =
  | (Partial<CreateOrderItems> & {
      id: string;
    })
  | CreateOrderItems;

export interface EditOrder extends Partial<
  Omit<
    CreateOrder,
    "orderItems" | "deliveryOrder" | "takeawayOrder" | "dineInOrder"
  >
> {
  id: string;
  deliveryOrder?: EditDeliveryOrder;
  takeawayOrder?: EditTakeawayOrder;
  dineInOrder?: EditDineInOrder;
  orderItems?: EditOrderItems[];
  deletedOrderItemIds?: string[];
}

interface OrderItems {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string };
}

export interface DeliveryOrderResponse {
  id: string;
  deliveryFee: number;
  name: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
}

export interface TakeawayOrderResponse {
  id: string;
  name: string;
  phone: string | null;
  pickUpTime: string;
}

export type TableStatus = "AVAILABLE" | "OCCUPIED";

export interface DineInOrderResponse {
  id: string;
  tableId: string;
  name: string | null;
  guestCount: number;
  table: {
    id: string;
    tableNumber: string;
    name: string | null;
    capacity: number;
    status: TableStatus;
  };
}

export interface OrderResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  cashierId: string;
  cashierName: string;
  customerId: string | null;
  type: OrderType;
  referenceId: string;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  status: OrderStatus;
  deliveryOrder: DeliveryOrderResponse | null;
  takeawayOrder: TakeawayOrderResponse | null;
  dineInOrder: DineInOrderResponse | null;
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
