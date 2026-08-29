import axios from "axios";
import { AuthRegister, AuthRegisterResponse } from "./auth.types";
import { api, baseApiUrl } from "@/constants/api";

export async function register(
  data: AuthRegister,
): Promise<AuthRegisterResponse> {
  const response = await axios.post<AuthRegisterResponse>(
    `${baseApiUrl}${api.auth.register}`,
    data, // <-- FIXED: actually sending the payload
  );
  return response.data;
}
