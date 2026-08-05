import type { User } from "./users.types";

const users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@adminjualan.com",
    role: "Administrator",
    status: "active",
  },
  {
    id: 2,
    name: "Ben Williams",
    email: "ben@adminjualan.com",
    role: "Sales",
    status: "active",
  },
  {
    id: 3,
    name: "Citra Sari",
    email: "citra@adminjualan.com",
    role: "Inventory",
    status: "inactive",
  },
  {
    id: 4,
    name: "Dimas Hartono",
    email: "dimas@adminjualan.com",
    role: "Finance",
    status: "active",
  },
];

export async function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => setTimeout(() => resolve(users), 400));
}
