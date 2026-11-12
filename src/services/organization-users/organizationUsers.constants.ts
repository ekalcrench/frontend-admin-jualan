import { OrganizationUserFilterPayload } from "@/types/organizationUser";

export const organizationUserKeys = {
  all: ["organization_users"] as const,

  lists: ["organization_users", "list"] as const,
  list: (params: OrganizationUserFilterPayload) =>
    ["organization_users", "list", params] as const,
};
