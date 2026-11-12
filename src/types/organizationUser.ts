import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export type OrganizationUserRole = "MEMBER" | "ADMIN" | "OWNER";

export type OrganizationUserStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export interface CreateOrganizationUser {
  userId: string;
  role: OrganizationUserRole;
  status: OrganizationUserStatus;
}

export interface EditOrganizationUser extends Partial<CreateOrganizationUser> {
  id: string;
}

export interface OrganizationUserResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  email: string;
  role: OrganizationUserRole;
  status: OrganizationUserStatus;
  approvedAt: string | null;
  approvedById: string | null;
  updatedById: string | null;
}

export interface OrganizationUserFilterPayload extends DefaultFilter {
  search?: string;
}
