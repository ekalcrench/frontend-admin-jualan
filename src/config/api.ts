import axios from "axios";
import { baseApiUrl } from "@/constants/api";
import useAuthStore from "@/store/auth-store";
import { paths } from "@/constants/path";
import { ApiErrorResponse } from "@/types/api";

export const apiClient = axios.create({
  baseURL: baseApiUrl,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const responseData = error.response?.data;
      const isUnauthorized =
        error.response?.status === 403 ||
        responseData?.statusCode === 403 ||
        responseData?.message === "Unauthorized";

      if (isUnauthorized) {
        useAuthStore.getState().logout();

        if (window.location.pathname !== paths.login) {
          window.location.assign(paths.login);
        }
      }
    }

    return Promise.reject(error);
  },
);
