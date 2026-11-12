import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import {
  EditInventoryLot,
  InventoryLotFilterPayload,
  InventoryLotResponse,
} from "@/types/inventoryLot";

export async function fetchInventoryLots(
  payload: InventoryLotFilterPayload,
): Promise<PaginatedData<InventoryLotResponse>> {
  const response = await apiClient.get<PaginatedData<InventoryLotResponse>>(
    api.inventoryLots.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function editInventoryLot(
  data: EditInventoryLot,
): Promise<InventoryLotResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<InventoryLotResponse>(
    api.inventoryLots.byId(data.id),
    remainingData,
  );
  return response.data;
}
