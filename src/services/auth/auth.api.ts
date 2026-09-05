import { apiClient } from "@/config/api";
import {
  AuthLogin,
  AuthLoginResponse,
  AuthRegister,
  AuthRegisterResponse,
  AuthRegisterVerify,
  AuthResendOtp,
  AuthResendOtpResponse,
} from "./auth.types";
import { api } from "@/constants/api";

export async function register(
  data: AuthRegister,
): Promise<AuthRegisterResponse> {
  const response = await apiClient.post<AuthRegisterResponse>(
    api.auth.register,
    data,
  );

  return response.data;
}

export async function registerVerify(
  data: AuthRegisterVerify,
): Promise<AuthRegisterResponse> {
  const response = await apiClient.put<AuthRegisterResponse>(
    api.auth.registerVerify,
    data,
  );

  return response.data;
}

export async function registerVerifyCheck(
  email: string,
): Promise<AuthResendOtpResponse> {
  const response = await apiClient.get<AuthResendOtpResponse>(
    api.auth.registerVerify,
    { params: { email } },
  );

  return response.data;
}

export async function resendOtp(
  data: AuthResendOtp,
): Promise<AuthResendOtpResponse> {
  const response = await apiClient.post<AuthResendOtpResponse>(
    api.auth.resendOtp,
    data,
  );

  return response.data;
}

export async function login(data: AuthLogin): Promise<AuthLoginResponse> {
  const response = await apiClient.post<AuthLoginResponse>(
    api.auth.login,
    data,
  );

  return response.data;
}
