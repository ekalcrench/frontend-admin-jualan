import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import { CreateInventoryItem, EditInventoryItem } from "./inventoryItems.types";
import {
  InventoryItemFilterPayload,
  InventoryItemOptions,
  InventoryItemResponse,
} from "@/types/inventoryItem";

export async function fetchInventoryItems(
  payload: InventoryItemFilterPayload,
): Promise<PaginatedData<InventoryItemResponse>> {
  const response = await apiClient.get<PaginatedData<InventoryItemResponse>>(
    api.inventoryItems.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function fetchInventoryItemOptions(
  search: string,
): Promise<InventoryItemOptions[]> {
  const response = await apiClient.get<InventoryItemOptions[]>(
    api.inventoryItems.options,
    {
      params: { search },
    },
  );
  return response.data;
}

export async function fetchInventoryItemById(
  id: string,
): Promise<InventoryItemResponse> {
  const response = await apiClient.get<InventoryItemResponse>(
    api.inventoryItems.byId(id),
  );
  return response.data;
}

export async function createInventoryItem(
  data: CreateInventoryItem,
): Promise<InventoryItemResponse> {
  const response = await apiClient.post<InventoryItemResponse>(
    api.inventoryItems.base,
    data,
  );
  return response.data;
}

export async function editInventoryItem(
  data: EditInventoryItem,
): Promise<InventoryItemResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<InventoryItemResponse>(
    api.inventoryItems.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.inventoryItems.byId(id));
  return response.data;
}
