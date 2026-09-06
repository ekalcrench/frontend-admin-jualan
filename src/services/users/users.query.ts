import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./users.api";
import { fiveMinutes } from "@/constants/time";
import { User } from "@/types/user";

export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: fiveMinutes,
  });
}
