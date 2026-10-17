import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import { OrderFilterPayload, OrderResponse } from "@/types/order";
import { ordersKeys } from "./orders.constants";
import { fetchOrderById, fetchOrders } from "./orders.api";

export function useOrderQuery(payload: OrderFilterPayload) {
  return useQuery<PaginatedData<OrderResponse>>({
    queryKey: ordersKeys.list(payload),
    queryFn: () => fetchOrders(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useOrderByIdQuery(id?: string) {
  return useQuery<OrderResponse>({
    queryKey: ordersKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("Order id is required");
      }

      return fetchOrderById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}
