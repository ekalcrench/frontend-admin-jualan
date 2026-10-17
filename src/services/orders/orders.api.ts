import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import { OrderFilterPayload, OrderResponse } from "@/types/order";
import { CreateOrder, EditOrder } from "./orders.types";

export async function fetchOrders(
  payload: OrderFilterPayload,
): Promise<PaginatedData<OrderResponse>> {
  const response = await apiClient.get<PaginatedData<OrderResponse>>(
    api.orders.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function fetchOrderById(id: string): Promise<OrderResponse> {
  const response = await apiClient.get<OrderResponse>(api.orders.byId(id));
  return response.data;
}

export async function createOrder(data: CreateOrder): Promise<OrderResponse> {
  const response = await apiClient.post<OrderResponse>(api.orders.base, data);
  return response.data;
}

export async function editOrder(data: EditOrder): Promise<OrderResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<OrderResponse>(
    api.orders.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.orders.byId(id));
  return response.data;
}
