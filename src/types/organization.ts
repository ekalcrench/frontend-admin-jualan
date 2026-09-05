import { BaseApiResponse } from "./api";

export type OrganizationRole = "MEMBER" | "ADMIN" | "OWNER";
export type OrganizationStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export interface Organization extends BaseApiResponse {
  organizationId: string;
  role: OrganizationRole;
  approvedAt: string;
  approvedById: string;
  updatedById: string;
  status: OrganizationStatus;
}
