import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import { fetchOrganizationUsers } from "./organizationUsers.api";
import { organizationUserKeys } from "./organizationUsers.constants";
import {
  OrganizationUserFilterPayload,
  OrganizationUserResponse,
} from "@/types/organizationUser";

export function useOrganizationUsersQuery(
  payload: OrganizationUserFilterPayload,
) {
  return useQuery<PaginatedData<OrganizationUserResponse>>({
    queryKey: organizationUserKeys.list(payload),
    queryFn: () => fetchOrganizationUsers(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
