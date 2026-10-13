export type OrganizationRole = "ADMIN" | "MEMBER" | "OWNER";

export const organizationRole: Record<OrganizationRole, OrganizationRole> = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
  OWNER: "OWNER",
};
