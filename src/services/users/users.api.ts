import { apiClient } from "@/config/api";
import type { User } from "./users.types";
import { api } from "@/constants/api";

export async function fetchUsers(): Promise<User[]> {
  const response = await apiClient.get<User[]>(api.users.base);
  return response.data;
}
