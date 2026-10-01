import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import {
  UserOrganization,
  UserOrganizationDetail,
  UserOrganizationFilterPayload,
} from "@/types/user";
import {
  CreateOrganizationUser,
  EditOrganizationUser,
} from "./organizationUsers.types";

export async function fetchOrganizationUsers(
  payload: UserOrganizationFilterPayload,
): Promise<PaginatedData<UserOrganization>> {
  const response = await apiClient.get<PaginatedData<UserOrganization>>(
    api.organizationUsers.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function createOrganizationUser(
  data: CreateOrganizationUser,
): Promise<UserOrganizationDetail> {
  const response = await apiClient.post<UserOrganizationDetail>(
    api.organizationUsers.base,
    data,
  );
  return response.data;
}

export async function editOrganizationUser(
  data: EditOrganizationUser,
): Promise<UserOrganizationDetail> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<UserOrganizationDetail>(
    api.organizationUsers.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function approveOrganizationUser(
  id: string,
): Promise<UserOrganizationDetail> {
  const response = await apiClient.post<UserOrganizationDetail>(
    api.organizationUsers.approve(id),
  );
  return response.data;
}

export async function suspendOrganizationUser(
  id: string,
): Promise<UserOrganizationDetail> {
  const response = await apiClient.post<UserOrganizationDetail>(
    api.organizationUsers.suspend(id),
  );
  return response.data;
}

export async function activateOrganizationUser(
  id: string,
): Promise<UserOrganizationDetail> {
  const response = await apiClient.post<UserOrganizationDetail>(
    api.organizationUsers.activate(id),
  );
  return response.data;
}
