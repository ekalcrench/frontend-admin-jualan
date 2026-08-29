import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./users.api";
import type { User } from "./users.types";
import { fiveMinutes } from "@/constants/time";

export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: fiveMinutes,
  });
}
