import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import { CreatePurchase, EditPurchase } from "./purchases.types";
import { PurchaseFilterPayload, PurchaseResponse } from "@/types/purchase";

export async function fetchPurchases(
  payload: PurchaseFilterPayload,
): Promise<PaginatedData<PurchaseResponse>> {
  const response = await apiClient.get<PaginatedData<PurchaseResponse>>(
    api.purchases.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function fetchPurchaseById(id: string): Promise<PurchaseResponse> {
  const response = await apiClient.get<PurchaseResponse>(
    api.purchases.byId(id),
  );
  return response.data;
}

export async function createPurchase(
  data: CreatePurchase,
): Promise<PurchaseResponse> {
  const response = await apiClient.post<PurchaseResponse>(
    api.purchases.base,
    data,
  );
  return response.data;
}

export async function editPurchase(
  data: EditPurchase,
): Promise<PurchaseResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<PurchaseResponse>(
    api.purchases.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deletePurchase(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.purchases.byId(id));
  return response.data;
}
