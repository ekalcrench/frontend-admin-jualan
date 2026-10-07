import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import { CreatePurchase, EditPurchase } from "./purchases.types";
import { PurchaseByPages, PurchaseFilterPayload } from "@/types/purchase";

export async function fetchPurchases(
  payload: PurchaseFilterPayload,
): Promise<PaginatedData<PurchaseByPages>> {
  const response = await apiClient.get<PaginatedData<PurchaseByPages>>(
    api.purchases.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function fetchPurchaseById(id: string): Promise<any> {
  const response = await apiClient.get<any>(api.purchases.byId(id));
  return response.data;
}

export async function createPurchase(data: CreatePurchase): Promise<any> {
  const response = await apiClient.post<any>(api.purchases.base, data);
  return response.data;
}

export async function editPurchase(data: EditPurchase): Promise<any> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<any>(
    api.purchases.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deletePurchase(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.purchases.byId(id));
  return response.data;
}
