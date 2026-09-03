import { User } from "@/types/user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  login: (user: User, accessToken: string) => Promise<void>;
  logout: () => void;
}
