import { BaseApiResponse } from "@/types/api";
import { UserStatus } from "@/types/user";

export interface AuthRegister {
  email: string;
  password: string;
  name: string;
}

export interface AuthRegisterResponse extends BaseApiResponse {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  emailVerifiedAt?: string;
}

export interface AuthRegisterVerify {
  email: string;
  code: string;
}

export interface AuthResendOtp {
  email: string;
}
