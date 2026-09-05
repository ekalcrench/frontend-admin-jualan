import { UserRole, UserStatus } from "@/types/user";

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
