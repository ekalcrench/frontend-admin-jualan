import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import {
  fetchInventoryItemOptions,
  fetchInventoryItems,
} from "./inventoryItems.api";
import { inventoryItemKeys } from "./inventoryItems.constants";
import {
  InventoryItemByPages,
  InventoryItemFilterPayload,
  InventoryItemOptions,
} from "@/types/inventoryItem";

export function useInventoryItemsQuery(payload: InventoryItemFilterPayload) {
  return useQuery<PaginatedData<InventoryItemByPages>>({
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
