import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import {
  InventoryTransactionFilterPayload,
  InventoryTransactionResponse,
} from "@/types/inventoryTransaction";

export async function fetchInventoryTransactions(
  payload: InventoryTransactionFilterPayload,
): Promise<PaginatedData<InventoryTransactionResponse>> {
  const response = await apiClient.get<
    PaginatedData<InventoryTransactionResponse>
  >(api.inventoryTransactions.base, {
    params: payload,
  });
  return response.data;
}
