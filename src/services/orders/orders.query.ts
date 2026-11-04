import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import {
  OrderFilterPayload,
  OrderResponse,
  OrderOverviewParams,
  OrderOverviewResponse,
  OrderOverviewItemsResponse,
} from "@/types/order";
import { ordersKeys } from "./orders.constants";
import {
  fetchOrderById,
  fetchOrders,
  fetchOrderOverview,
  fetchOrderOverviewItems,
} from "./orders.api";

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

export function useOrderOverviewQuery(params: OrderOverviewParams) {
  return useQuery<OrderOverviewResponse>({
    queryKey: ordersKeys.overview(params),
    queryFn: () => fetchOrderOverview(params),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useOrderOverviewItemsQuery(params: OrderOverviewParams) {
  return useQuery<OrderOverviewItemsResponse>({
    queryKey: ordersKeys.overviewItem(params),
    queryFn: () => fetchOrderOverviewItems(params),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
