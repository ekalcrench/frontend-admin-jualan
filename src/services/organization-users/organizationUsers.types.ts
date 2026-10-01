import { UserOrganizationRole, UserOrganizationStatus } from "@/types/user";

export interface CreateOrganizationUser {
  userId: string;
  role: UserOrganizationRole;
  status: UserOrganizationStatus;
}

export interface EditOrganizationUser extends Partial<CreateOrganizationUser> {
  id: string;
}
