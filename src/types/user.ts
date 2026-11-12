import { BaseApiResponse } from "./api";
import {
  OrganizationUserRole,
  OrganizationUserStatus,
} from "./organizationUser";
import { DefaultFilter } from "./table";

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

export interface UserFilterPayload extends DefaultFilter {
  search?: string;
}
export interface UserOptions {
  id: string;
  name: string;
  email: string;
}

export interface SelectedUserOrganization {
  id: string;
  name: string;
  role: OrganizationUserRole;
  status: OrganizationUserStatus;
  logoBase64?: string | null;
}
