import { UserFilterPayload } from "@/types/user";

export const userKeys = {
  all: ["users"] as const,

  lists: ["users", "list"] as const,
  list: (params: UserFilterPayload) => ["users", "list", params] as const,

  emails: ["users", "email"] as const,
  email: (email: string) => ["users", "email", email] as const,

  details: ["users", "detail"] as const,
  detail: (id?: string) => ["users", "detail", id] as const,

  options: (search: string) => ["users", "options", search] as const,

  organizations: (id?: string) => ["users", "organizations", id] as const,
};
