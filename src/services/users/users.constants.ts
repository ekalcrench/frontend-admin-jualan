import { UserFilterPayload } from "@/types/user";

export const userKeys = {
  all: ["users"] as const,

  lists: () => ["users", "list"] as const,
  list: (params: UserFilterPayload) => ["users", "list", params] as const,

  details: () => ["users", "detail"] as const,
  detail: (id?: string) => ["users", "detail", id] as const,

  organizations: (id?: string) => ["users", "organizations", id] as const,
};
