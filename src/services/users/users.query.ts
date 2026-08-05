import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./users.api";
import type { User } from "./users.types";

export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });
}
