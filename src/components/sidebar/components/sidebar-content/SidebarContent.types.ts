import { OrganizationRole } from "@/types/organization";
import { UserRole } from "@/types/user";

export interface SidebarListItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  userRoleAccess?: UserRole[];
  organizationRoleAccess?: OrganizationRole[];
  params?: string;
  child?: SidebarListItem[];
}
