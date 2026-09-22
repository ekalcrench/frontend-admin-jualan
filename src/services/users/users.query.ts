import { useQuery } from "@tanstack/react-query";
import { fetchUserById, fetchUsers } from "./users.api";
import { fiveMinutes } from "@/constants/time";
import { User, UserFilterPayload } from "@/types/user";
import { PaginatedData } from "@/types/table";
import { userKeys } from "./users.constants";

export function useUsersQuery(payload: UserFilterPayload) {
  return useQuery<PaginatedData<User>>({
    queryKey: userKeys.list(payload),
    queryFn: () => fetchUsers(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useUserByIdQuery(id?: string) {
  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error("User id is required");
      return fetchUserById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}
