import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { Organization, OrganizationFilterPayload } from "@/types/organization";
import { CreateOrganization, EditOrganization } from "./organizations.types";
import { PaginatedData } from "@/types/table";

export async function fetchOrganizations(
  payload: OrganizationFilterPayload,
): Promise<PaginatedData<Organization>> {
  const response = await apiClient.get<PaginatedData<Organization>>(
    api.organizations.base,
    { params: payload },
  );
  return response.data;
}

export async function fetchOrganizationById(id: string): Promise<Organization> {
  const response = await apiClient.get<Organization>(
    api.organizations.byId(id),
  );
  return response.data;
}

export async function createOrganization(
  data: CreateOrganization,
): Promise<Organization> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("address", data.address);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("file", data.file);

  const response = await apiClient.post<Organization>(
    api.organizations.base,
    formData,
  );

  return response.data;
}

export async function editOrganization(
  id: string,
  data: EditOrganization,
): Promise<Organization> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await apiClient.patch<Organization>(
    api.organizations.byId(id),
    formData,
  );

  return response.data;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.organizations.byId(id));

  return response.data;
}
