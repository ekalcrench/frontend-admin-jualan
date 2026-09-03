import { BaseApiResponse } from "./api";

export type UserStatus = "PENDING_EMAIL" | "ACTIVE" | "SUSPENDED";
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface User extends BaseApiResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
}
