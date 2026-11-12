import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import {
  CreateOrganizationUser,
  EditOrganizationUser,
  OrganizationUserFilterPayload,
  OrganizationUserResponse,
} from "@/types/organizationUser";
import { PaginatedData } from "@/types/table";

export async function fetchOrganizationUsers(
  payload: OrganizationUserFilterPayload,
): Promise<PaginatedData<OrganizationUserResponse>> {
  const response = await apiClient.get<PaginatedData<OrganizationUserResponse>>(
    api.organizationUsers.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function createOrganizationUser(
  data: CreateOrganizationUser,
): Promise<OrganizationUserResponse> {
  const response = await apiClient.post<OrganizationUserResponse>(
    api.organizationUsers.base,
    data,
  );
  return response.data;
}

export async function editOrganizationUser(
  data: EditOrganizationUser,
): Promise<OrganizationUserResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<OrganizationUserResponse>(
    api.organizationUsers.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function approveOrganizationUser(
  id: string,
): Promise<OrganizationUserResponse> {
  const response = await apiClient.post<OrganizationUserResponse>(
    api.organizationUsers.approve(id),
  );
  return response.data;
}

export async function suspendOrganizationUser(
  id: string,
): Promise<OrganizationUserResponse> {
  const response = await apiClient.post<OrganizationUserResponse>(
    api.organizationUsers.suspend(id),
  );
  return response.data;
}

export async function activateOrganizationUser(
  id: string,
): Promise<OrganizationUserResponse> {
  const response = await apiClient.post<OrganizationUserResponse>(
    api.organizationUsers.activate(id),
  );
  return response.data;
}
