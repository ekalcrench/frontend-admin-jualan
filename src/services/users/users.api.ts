import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { User } from "@/types/user";

export async function fetchUsers(): Promise<User[]> {
  const response = await apiClient.get<User[]>(api.users.base);
  return response.data;
}
