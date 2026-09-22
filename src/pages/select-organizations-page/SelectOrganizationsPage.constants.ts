import z from "zod";
import { UserOrganizationRole, UserOrganizationStatus } from "@/types/user";

const organizationRoles: UserOrganizationRole[] = ["MEMBER", "ADMIN", "OWNER"];

const organizationStatuses: UserOrganizationStatus[] = [
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
];

const organizationSchema = z.object(
  {
    id: z.string(),
    name: z.string(),
    role: z.enum(organizationRoles),
    status: z.enum(organizationStatuses),
    logoUrl: z.string(),
  },
  {
    error: "Pilih UMKM dahulu untuk login",
  },
);

export const selectOrganizationSchema = z.object({
  organization: organizationSchema,
});
