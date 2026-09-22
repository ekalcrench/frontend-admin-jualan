import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import {
  SelectedUserOrganization,
  User,
  UserFilterPayload,
} from "@/types/user";
import { EditUser } from "./users.types";

export async function fetchUsers(
  payload: UserFilterPayload,
): Promise<PaginatedData<User>> {
  const response = await apiClient.get<PaginatedData<User>>(api.users.base, {
    params: payload,
  });
  return response.data;
}

export async function fetchUserById(id: string): Promise<User> {
  const response = await apiClient.get<User>(api.users.byId(id));
  return response.data;
}

export async function fetchOrganizationsById(
  id: string,
): Promise<SelectedUserOrganization[]> {
  const response = await apiClient.get<SelectedUserOrganization[]>(
    api.users.organizations(id),
  );
  return response.data;
}

export async function editUser(data: EditUser): Promise<User> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<User>(
    api.users.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function suspendUser(id: string): Promise<User> {
  const response = await apiClient.post<User>(api.users.suspend(id));
  return response.data;
}

export async function activateUser(id: string): Promise<User> {
  const response = await apiClient.post<User>(api.users.activate(id));
  return response.data;
}
