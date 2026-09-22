import { UserRole, UserStatus } from "@/types/user";
import { ChipProps } from "@mui/material";

export const userStatus: Record<UserStatus, UserStatus> = {
  PENDING_EMAIL: "PENDING_EMAIL",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
};

export const userRole: Record<UserRole, UserRole> = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  USER: "USER",
};

export const userRoleMapping: Record<UserRole, string> = {
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
  USER: "User",
};

export const userStatusMapping: Record<UserStatus, string> = {
  PENDING_EMAIL: "Pending Email",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
};

export const userStatusColorMapping: Record<UserStatus, ChipProps["color"]> = {
  PENDING_EMAIL: "warning",
  ACTIVE: "success",
  SUSPENDED: "error",
};
