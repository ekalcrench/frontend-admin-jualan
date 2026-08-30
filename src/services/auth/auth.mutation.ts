import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register, registerVerify, resendOtp } from "./auth.api";
import {
  AuthRegister,
  AuthRegisterResponse,
  AuthRegisterVerify,
  AuthResendOtp,
} from "./auth.types";

export function useRegisterMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthRegister>({
    mutationFn: register,
    onSuccess: (result, variables, onMutateResult, context) => {
      console.log(">>> result : ", result);
      context.client.invalidateQueries({ queryKey: ["users"], exact: false });
      return result;
    },
  });
}

export function useRegisterVerifyMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthRegisterVerify>({
    mutationFn: registerVerify,
    onSuccess: (result, variables, onMutateResult, context) => {
      console.log(">>> result : ", result);
      context.client.invalidateQueries({ queryKey: ["users", result.email] });
      return result;
    },
  });
}

export function useResendOtpMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthResendOtp>({
    mutationFn: resendOtp,
    onSuccess: (result, variables, onMutateResult, context) => {
      console.log(">>> result : ", result);
      context.client.invalidateQueries({ queryKey: ["users", result.email] });
      return result;
    },
  });
}
