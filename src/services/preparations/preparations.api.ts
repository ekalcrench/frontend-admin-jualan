import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import {
  PreparationFilterPayload,
  PreparationResponse,
} from "@/types/preparations";
import { PaginatedData } from "@/types/table";
import { CreatePreparation, EditPreparation } from "./preparations.types";

export async function fetchPreparations(
  payload: PreparationFilterPayload,
): Promise<PaginatedData<PreparationResponse>> {
  const response = await apiClient.get<PaginatedData<PreparationResponse>>(
    api.preparations.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function fetchPreparationById(
  id: string,
): Promise<PreparationResponse> {
  const response = await apiClient.get<PreparationResponse>(
    api.preparations.byId(id),
  );
  return response.data;
}

export async function createPreparation(
  data: CreatePreparation,
): Promise<PreparationResponse> {
  const response = await apiClient.post<PreparationResponse>(
    api.preparations.base,
    data,
  );
  return response.data;
}

export async function editPreparation(
  data: EditPreparation,
): Promise<PreparationResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<PreparationResponse>(
    api.preparations.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deletePreparation(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.preparations.byId(id));
  return response.data;
}

export async function completePreparation(
  id: string,
): Promise<PreparationResponse> {
  const response = await apiClient.post<PreparationResponse>(
    api.preparations.complete(id),
  );
  return response.data;
}
