import { BaseApiResponse } from "./api";
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

export type UserOrganizationRole = "MEMBER" | "ADMIN" | "OWNER";
export type UserOrganizationStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export interface UserOrganization extends BaseApiResponse {
  id: string;
  name: string;
  email: string;
  role: UserOrganizationRole;
  status: UserOrganizationStatus;
  approvedAt: string | null;
  approvedById: string | null;
  updatedById: string | null;
}

export interface UserFilterPayload extends DefaultFilter {
  search?: string;
}

export interface UserOrganizationFilterPayload extends DefaultFilter {
  search?: string;
}

export interface SelectedUserOrganization extends Pick<
  UserOrganization,
  "id" | "role" | "status"
> {
  name: string;
  logoUrl: string;
}

export interface UserOrganizationDetail extends BaseApiResponse {
  id: string;
  userId: string;
  organizationId: string;
  role: UserOrganizationRole;
  status: UserOrganizationStatus;
  approvedAt: string | null;
  approvedById: string | null;
  updatedById: string | null;
}

export interface UserOptions {
  id: string;
  name: string;
  email: string;
}
