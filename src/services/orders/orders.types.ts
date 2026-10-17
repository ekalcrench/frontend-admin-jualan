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
