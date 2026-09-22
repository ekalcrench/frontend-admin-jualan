import { SelectedUserOrganization, User } from "@/types/user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  organization: SelectedUserOrganization | null;
  login: (user: User, accessToken: string) => void;
  loginOrganization: (organization: SelectedUserOrganization) => void;
  logout: () => void;
}
