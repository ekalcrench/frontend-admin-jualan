import { useMutation } from "@tanstack/react-query";
import { login, register, registerVerify, resendOtp } from "./auth.api";
import {
  AuthLogin,
  AuthLoginResponse,
  AuthRegister,
  AuthRegisterResponse,
  AuthRegisterVerify,
  AuthResendOtp,
} from "./auth.types";

export function useLoginMutation() {
  return useMutation<AuthLoginResponse, Error, AuthLogin>({
    mutationFn: login,
  });
}

export function useRegisterMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthRegister>({
    mutationFn: register,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["users", result.email] });
    },
  });
}

export function useRegisterVerifyMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthRegisterVerify>({
    mutationFn: registerVerify,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["users", result.email] });
    },
  });
}

export function useResendOtpMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthResendOtp>({
    mutationFn: resendOtp,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["users", result.email] });
    },
  });
}
