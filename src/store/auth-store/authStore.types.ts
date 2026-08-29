export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}
