import { useQuery } from "@tanstack/react-query";
import { fiveSeconds, thirtyMinutes } from "@/constants/time";
import { registerVerifyCheck } from "./auth.api";
import { AuthResendOtpResponse } from "./auth.types";

export function useRegisterVerifyQuery(email: string) {
  return useQuery<AuthResendOtpResponse>({
    queryKey: ["users", email],
    queryFn: () => registerVerifyCheck(email),
    staleTime: thirtyMinutes,
    enabled: !!email,
  });
}
