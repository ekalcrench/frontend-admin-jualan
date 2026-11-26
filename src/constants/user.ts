import { LabelValue } from "@/types/generalTypes";
import {
  OrganizationUserRole,
  OrganizationUserStatus,
} from "@/types/organizationUser";
import { UserRole, UserStatus } from "@/types/user";
import { ChipProps } from "@mui/material";

export const userStatus: Record<UserStatus, UserStatus> = {
  PENDING_EMAIL: "PENDING_EMAIL",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
};

export const userOrganizationStatus: Record<
  OrganizationUserStatus,
  OrganizationUserStatus
> = {
  APPROVED: "APPROVED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
};

export const userRole: Record<UserRole, UserRole> = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  USER: "USER",
};

export const userOrganizationRole: Record<
  OrganizationUserRole,
  OrganizationUserRole
> = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
  OWNER: "OWNER",
};

export const userRoleMapping: Record<UserRole, string> = {
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
  USER: "User",
};

export const userOrganizationRoleLabels: Record<OrganizationUserRole, string> =
  {
    ADMIN: "Admin",
    MEMBER: "User",
    OWNER: "Pemilik Usaha",
  };

export const userStatusLabels: Record<UserStatus, string> = {
  PENDING_EMAIL: "Pending Email",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
};

export const userStatusOptions: UserStatus[] = [
  userStatus.ACTIVE,
  userStatus.PENDING_EMAIL,
  userStatus.SUSPENDED,
];

export const userStatusColorMapping: Record<UserStatus, ChipProps["color"]> = {
  PENDING_EMAIL: "warning",
  ACTIVE: "success",
  SUSPENDED: "error",
};

export const userOrganizationStatusMapping: Record<
  OrganizationUserStatus,
  string
> = {
  APPROVED: "Approved",
  PENDING_APPROVAL: "Pending Approval",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export const userOrganizationStatusColorMapping: Record<
  OrganizationUserStatus,
  ChipProps["color"]
> = {
  APPROVED: "success",
  PENDING_APPROVAL: "warning",
  REJECTED: "default",
  SUSPENDED: "error",
};

export const userOrganizationRoleOptions: LabelValue<OrganizationUserRole>[] = [
  {
    value: "OWNER",
    label: "Pemilik Usaha (Punya akses penuh)",
  },
  { value: "ADMIN", label: "Admin (Bisa melihat dan menambah data)" },
  { value: "MEMBER", label: "User (Hanya bisa melihat data)" },
];

export const userOrganizationStatusOptions: LabelValue<OrganizationUserStatus>[] =
  [
    { value: "APPROVED", label: "Approved" },
    { value: "PENDING_APPROVAL", label: "Pending Approval" },
    { value: "REJECTED", label: "Rejected" },
    { value: "SUSPENDED", label: "Suspended" },
  ];
