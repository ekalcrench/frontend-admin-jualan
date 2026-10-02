import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import { CreateInventoryItem, EditInventoryItem } from "./inventoryItems.types";
import {
  InventoryItem,
  InventoryItemByPages,
  InventoryItemFilterPayload,
} from "@/types/inventoryItem";

export async function fetchInventoryItems(
  payload: InventoryItemFilterPayload,
): Promise<PaginatedData<InventoryItemByPages>> {
  const response = await apiClient.get<PaginatedData<InventoryItemByPages>>(
    api.inventoryItems.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function createInventoryItem(
  data: CreateInventoryItem,
): Promise<InventoryItem> {
  const response = await apiClient.post<InventoryItem>(
    api.inventoryItems.base,
    data,
  );
  return response.data;
}

export async function editInventoryItem(
  data: EditInventoryItem,
): Promise<InventoryItem> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<InventoryItem>(
    api.inventoryItems.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.inventoryItems.byId(id));
  return response.data;
}
