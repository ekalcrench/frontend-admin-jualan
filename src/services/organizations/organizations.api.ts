import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import {
  OrganizationResponse,
  OrganizationFilterPayload,
} from "@/types/organization";
import { CreateOrganization, EditOrganization } from "./organizations.types";
import { PaginatedData } from "@/types/table";

export async function fetchOrganizations(
  payload: OrganizationFilterPayload,
): Promise<PaginatedData<OrganizationResponse>> {
  const response = await apiClient.get<PaginatedData<OrganizationResponse>>(
    api.organizations.base,
    { params: payload },
  );
  return response.data;
}

export async function fetchOrganizationById(
  id: string,
): Promise<OrganizationResponse> {
  const response = await apiClient.get<OrganizationResponse>(
    api.organizations.byId(id),
  );
  return response.data;
}

export async function createOrganization(
  data: CreateOrganization,
): Promise<OrganizationResponse> {
  const response = await apiClient.post<OrganizationResponse>(
    api.organizations.base,
    data,
  );

  return response.data;
}

export async function editOrganization(
  id: string,
  data: EditOrganization,
): Promise<OrganizationResponse> {
  const response = await apiClient.patch<OrganizationResponse>(
    api.organizations.byId(id),
    data,
  );

  return response.data;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.organizations.byId(id));

  return response.data;
}
