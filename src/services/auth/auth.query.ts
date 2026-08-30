import { useQuery } from "@tanstack/react-query";
import { fiveSeconds, thirtyMinutes } from "@/constants/time";
import { registerVerifyCheck } from "./auth.api";
import { AuthRegisterResponse } from "./auth.types";

export function useRegisterVerifyQuery(email: string) {
  return useQuery<AuthRegisterResponse>({
    queryKey: ["users", email],
    queryFn: () => registerVerifyCheck(email),
    staleTime: thirtyMinutes,
    enabled: !!email,
  });
}
