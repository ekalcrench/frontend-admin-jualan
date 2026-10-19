import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import {
  InventoryTransactionFilterPayload,
  InventoryTransactionResponse,
} from "@/types/inventoryTransaction";
import { inventoryTransactionKeys } from "./inventoryTransactions.constants";
import { fetchInventoryTransactions } from "./inventoryTransactions.api";

export function useInventoryTransactionsQuery(
  payload: InventoryTransactionFilterPayload,
) {
  return useQuery<PaginatedData<InventoryTransactionResponse>>({
    queryKey: inventoryTransactionKeys.list(payload),
    queryFn: () => fetchInventoryTransactions(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
