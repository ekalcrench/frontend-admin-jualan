import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { Organization, OrganizationFilterPayload } from "@/types/organization";
import { fetchOrganizationById, fetchOrganizations } from "./organizations.api";
import { PaginatedData } from "@/types/table";
import { organizationKeys } from "./organizations.constants";

export function useOrganizationsQuery(payload: OrganizationFilterPayload) {
  return useQuery<PaginatedData<Organization>>({
    queryKey: organizationKeys.list(payload),
    queryFn: () => fetchOrganizations(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useOrganizationByIdQuery(id?: string) {
  return useQuery<Organization>({
    queryKey: organizationKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("Organization id is required");
      }

      return fetchOrganizationById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}
