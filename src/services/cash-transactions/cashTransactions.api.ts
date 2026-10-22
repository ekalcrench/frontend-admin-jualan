import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import {
  CashTransactionBalanceFilter,
  CashTransactionBalanceResponse,
  CashTransactionFilterPayload,
  CashTransactionResponse,
} from "@/types/cashTransaction";
import { PaginatedData } from "@/types/table";
import {
  CreateCashTransaction,
  EditCashTransaction,
} from "./cashTransactions.types";

export async function fetchCashTransactions(
  payload: CashTransactionFilterPayload,
): Promise<PaginatedData<CashTransactionResponse>> {
  const response = await apiClient.get<PaginatedData<CashTransactionResponse>>(
    api.cashTransactions.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function fetchCashTransactionById(
  id: string,
): Promise<CashTransactionResponse> {
  const response = await apiClient.get<CashTransactionResponse>(
    api.cashTransactions.byId(id),
  );
  return response.data;
}

export async function fetchCashTransactionBalance(
  params: CashTransactionBalanceFilter,
): Promise<CashTransactionBalanceResponse> {
  const response = await apiClient.get<CashTransactionBalanceResponse>(
    api.cashTransactions.balance,
    { params },
  );
  return response.data;
}

export async function createCashTransaction(
  data: CreateCashTransaction,
): Promise<CashTransactionResponse> {
  const response = await apiClient.post<CashTransactionResponse>(
    api.cashTransactions.base,
    data,
  );
  return response.data;
}

export async function editCashTransaction(
  data: EditCashTransaction,
): Promise<CashTransactionResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<CashTransactionResponse>(
    api.cashTransactions.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deleteCashTransaction(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(
    api.cashTransactions.byId(id),
  );
  return response.data;
}
