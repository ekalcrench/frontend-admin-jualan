import axios from "axios";
import {
  AuthLogin,
  AuthLoginResponse,
  AuthRegister,
  AuthRegisterResponse,
  AuthRegisterVerify,
  AuthResendOtp,
  AuthResendOtpResponse,
} from "./auth.types";
import { api, baseApiUrl } from "@/constants/api";

export async function register(
  data: AuthRegister,
): Promise<AuthRegisterResponse> {
  const response = await axios.post<AuthRegisterResponse>(
    `${baseApiUrl}${api.auth.register}`,
    data,
  );

  return response.data;
}

export async function registerVerify(
  data: AuthRegisterVerify,
): Promise<AuthRegisterResponse> {
  const response = await axios.put<AuthRegisterResponse>(
    `${baseApiUrl}${api.auth.registerVerify}`,
    data,
  );

  return response.data;
}

export async function registerVerifyCheck(
  email: string,
): Promise<AuthResendOtpResponse> {
  const response = await axios.get<AuthResendOtpResponse>(
    `${baseApiUrl}${api.auth.registerVerify}?email=${email}`,
  );

  return response.data;
}

export async function resendOtp(
  data: AuthResendOtp,
): Promise<AuthResendOtpResponse> {
  const response = await axios.post<AuthResendOtpResponse>(
    `${baseApiUrl}${api.auth.resendOtp}`,
    data,
  );

  return response.data;
}

export async function login(data: AuthLogin): Promise<AuthLoginResponse> {
  const response = await axios.post<AuthLoginResponse>(
    `${baseApiUrl}${api.auth.login}`,
    data,
  );

  return response.data;
}
