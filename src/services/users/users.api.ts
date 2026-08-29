import axios from "axios";
import type { User } from "./users.types";

const API_BASE_URL = "http://localhost:8080";

export async function fetchUsers(): Promise<User[]> {
  const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
  return response.data;
}
