import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { Organization } from "@/types/organization";

export async function fetchOrganizations(): Promise<Organization[]> {
  const response = await apiClient.get<Organization[]>(api.organizations.base);
  return response.data;
}
