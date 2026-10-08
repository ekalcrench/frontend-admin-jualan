import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import {
  fetchInventoryItemById,
  fetchInventoryItemOptions,
  fetchInventoryItems,
} from "./inventoryItems.api";
import { inventoryItemKeys } from "./inventoryItems.constants";
import {
  InventoryItemFilterPayload,
  InventoryItemOptions,
  InventoryItemResponse,
} from "@/types/inventoryItem";

export function useInventoryItemsQuery(payload: InventoryItemFilterPayload) {
  return useQuery<PaginatedData<InventoryItemResponse>>({
    queryKey: inventoryItemKeys.list(payload),
    queryFn: () => fetchInventoryItems(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useInventoryItemOptionsQuery(search: string) {
  return useQuery<InventoryItemOptions[]>({
    queryKey: inventoryItemKeys.options(search),
    queryFn: () => fetchInventoryItemOptions(search),
    enabled: search.length > 2,
    staleTime: fiveMinutes,
  });
}

export function useInventoryItemByIdQuery(id?: string) {
  return useQuery<InventoryItemResponse>({
    queryKey: inventoryItemKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("Inventory item id is required");
      }

      return fetchInventoryItemById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}
