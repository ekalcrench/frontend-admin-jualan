import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import { fetchInventoryItems } from "./inventoryItems.api";
import { inventoryItemKeys } from "./inventoryItems.constants";
import {
  InventoryItemByPages,
  InventoryItemFilterPayload,
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
