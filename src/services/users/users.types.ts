import { UserRole, UserStatus } from "@/types/user";

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface EditUser extends Partial<Omit<CreateUser, "password">> {
  id: string;
  password?: string;
}
