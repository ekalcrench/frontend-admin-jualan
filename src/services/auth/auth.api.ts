import axios from "axios";
import {
  AuthRegister,
  AuthRegisterResponse,
  AuthRegisterVerify,
  AuthResendOtp,
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

  console.log(">>> response : ", response);

  return response.data;
}

export async function registerVerifyCheck(
  email: string,
): Promise<AuthRegisterResponse> {
  const response = await axios.get<AuthRegisterResponse>(
    `${baseApiUrl}${api.auth.registerVerify}?email=${email}`,
  );

  return response.data;
}

export async function resendOtp(
  data: AuthResendOtp,
): Promise<AuthRegisterResponse> {
  const response = await axios.post<AuthRegisterResponse>(
    `${baseApiUrl}${api.auth.resendOtp}`,
    data,
  );

  console.log(">>> response : ", response);

  return response.data;
}
