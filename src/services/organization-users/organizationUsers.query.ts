import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { UserOrganization, UserOrganizationFilterPayload } from "@/types/user";
import { PaginatedData } from "@/types/table";
import { fetchOrganizationUsers } from "./organizationUsers.api";
import { organizationUserKeys } from "./organizationUsers.constants";

export function useOrganizationUsersQuery(
  payload: UserOrganizationFilterPayload,
) {
  return useQuery<PaginatedData<UserOrganization>>({
    queryKey: organizationUserKeys.list(payload),
    queryFn: () => fetchOrganizationUsers(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
