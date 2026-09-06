import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { Organization } from "@/types/organization";
import { fetchOrganizations } from "./organizations.api";

export function useOrganizationsQuery() {
  return useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    staleTime: fiveMinutes,
  });
}
