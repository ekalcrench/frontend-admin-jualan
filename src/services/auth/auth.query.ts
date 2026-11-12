import { useQuery } from "@tanstack/react-query";
import { thirtyMinutes } from "@/constants/time";
import { registerVerifyCheck } from "./auth.api";
import { userKeys } from "../users/users.constants";
import { AuthResendOtpResponse } from "@/types/auth";

export function useRegisterVerifyQuery(email: string) {
  return useQuery<AuthResendOtpResponse>({
    queryKey: userKeys.email(email),
    queryFn: () => registerVerifyCheck(email),
    staleTime: thirtyMinutes,
    enabled: !!email,
  });
}
