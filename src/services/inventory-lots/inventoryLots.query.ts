import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import {
  InventoryLotFilterPayload,
  InventoryLotsResponse,
} from "@/types/inventoryLot";
import { inventoryLotKeys } from "./inventoryLots.constants";
import { fetchInventoryLots } from "./inventoryLots.api";

export function useInventoryLotsQuery(payload: InventoryLotFilterPayload) {
  return useQuery<PaginatedData<InventoryLotsResponse>>({
    queryKey: inventoryLotKeys.list(payload),
    queryFn: () => fetchInventoryLots(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
