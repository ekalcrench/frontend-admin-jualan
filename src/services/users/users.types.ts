import { UserRole, UserStatus } from "@/types/user";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
};
