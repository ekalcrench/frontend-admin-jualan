import { User } from "@/types/user";

export interface AuthLogin {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  user: User;
  accessToken: string;
}

export interface AuthRegister {
  email: string;
  password: string;
  name: string;
}

export interface AuthRegisterResponse extends User {}

export interface AuthRegisterVerify {
  email: string;
  code: string;
}

export interface AuthResendOtp {
  email: string;
}

export interface AuthResendOtpResponse {
  user: User;
  otpValidResendTime: string;
}
