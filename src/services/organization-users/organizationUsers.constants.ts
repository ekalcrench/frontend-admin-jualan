import { UserOrganizationFilterPayload } from "@/types/user";

export const organizationUserKeys = {
  all: ["organization_users"] as const,

  lists: () => ["organization_users", "list"] as const,
  list: (params: UserOrganizationFilterPayload) =>
    ["organization_users", "list", params] as const,

  details: () => ["organization_users", "detail"] as const,
  detail: (id?: string) => ["organization_users", "detail", id] as const,
};
