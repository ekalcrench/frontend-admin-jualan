import {
  OrganizationUserRole,
  OrganizationUserStatus,
} from "@/types/organizationUser";
import z from "zod";

const organizationRoles: OrganizationUserRole[] = ["MEMBER", "ADMIN", "OWNER"];

const organizationStatuses: OrganizationUserStatus[] = [
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
    logoBase64: z.string(),
  },
  {
    error: "Pilih UMKM dahulu untuk login",
  },
);

export const selectOrganizationSchema = z.object({
  organization: organizationSchema,
});
