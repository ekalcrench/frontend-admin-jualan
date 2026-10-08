import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import {
  InventoryLotFilterPayload,
  InventoryLotsResponse,
} from "@/types/inventoryLot";

export async function fetchInventoryLots(
  payload: InventoryLotFilterPayload,
): Promise<PaginatedData<InventoryLotsResponse>> {
  const response = await apiClient.get<PaginatedData<InventoryLotsResponse>>(
    api.inventoryLots.base,
    {
      params: payload,
    },
  );
  return response.data;
}
