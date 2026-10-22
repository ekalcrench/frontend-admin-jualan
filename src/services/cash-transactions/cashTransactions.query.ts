import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import { cashTransactionsKeys } from "./cashTransactions.constants";
import {
  fetchCashTransactionBalance,
  fetchCashTransactionById,
  fetchCashTransactions,
} from "./cashTransactions.api";
import {
  CashTransactionBalanceFilter,
  CashTransactionBalanceResponse,
  CashTransactionFilterPayload,
  CashTransactionResponse,
} from "@/types/cashTransaction";

export function useCashTransactionsQuery(
  payload: CashTransactionFilterPayload,
) {
  return useQuery<PaginatedData<CashTransactionResponse>>({
    queryKey: cashTransactionsKeys.list(payload),
    queryFn: () => fetchCashTransactions(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useCashTransactionByIdQuery(id?: string) {
  return useQuery<CashTransactionResponse>({
    queryKey: cashTransactionsKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("CashTransaction id is required");
      }

      return fetchCashTransactionById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}

export function useCashTransactionBalanceQuery(
  params: CashTransactionBalanceFilter,
) {
  return useQuery<CashTransactionBalanceResponse>({
    queryKey: cashTransactionsKeys.balance(params),
    queryFn: () => fetchCashTransactionBalance(params),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
