import { Organization } from "@/types/organization";
import { User } from "@/types/user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  organization: Organization | null;
  login: (user: User, accessToken: string) => void;
  loginOrganization: (organization: Organization) => void;
  logout: () => void;
}
