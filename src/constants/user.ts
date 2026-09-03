import { UserStatus } from "@/types/user";

export const userStatus: Record<UserStatus, UserStatus> = {
  PENDING_EMAIL: "PENDING_EMAIL",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
