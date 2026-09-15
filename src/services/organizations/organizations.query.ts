import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { Organization, OrganizationFilterPayload } from "@/types/organization";
import { fetchOrganizations } from "./organizations.api";
import { PaginatedData } from "@/types/table";

export function useOrganizationsQuery(payload: OrganizationFilterPayload) {
  return useQuery<PaginatedData<Organization>>({
    queryKey: ["organizations", payload],
    queryFn: () => fetchOrganizations(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
