import { OrganizationFilterPayload } from "@/types/organization";

export const organizationKeys = {
  all: ["organizations"] as const,

  lists: () => ["organizations", "list"] as const,
  list: (params: OrganizationFilterPayload) =>
    ["organizations", "list", params] as const,

  details: () => ["organizations", "detail"] as const,
  detail: (id?: string) => ["organizations", "detail", id] as const,
};
