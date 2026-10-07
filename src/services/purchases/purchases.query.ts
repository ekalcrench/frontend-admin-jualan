import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import { fetchPurchaseById, fetchPurchases } from "./purchases.api";
import { purchasesKeys } from "./purchases.constants";
import { PurchaseFilterPayload } from "@/types/purchase";

export function usePurchasesQuery(payload: PurchaseFilterPayload) {
  return useQuery<PaginatedData<any>>({
    queryKey: purchasesKeys.list(payload),
    queryFn: () => fetchPurchases(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePurchaseByIdQuery(id?: string) {
  return useQuery<any>({
    queryKey: purchasesKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("Purchase id is required");
      }

      return fetchPurchaseById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}
