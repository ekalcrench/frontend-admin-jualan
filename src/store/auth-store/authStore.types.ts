import { UserOrganization } from "@/types/organization";
import { User } from "@/types/user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  organization: UserOrganization | null;
  login: (user: User, accessToken: string) => void;
  loginOrganization: (organization: UserOrganization) => void;
  logout: () => void;
}
