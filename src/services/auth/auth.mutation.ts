import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "./auth.api";
import { AuthRegister, AuthRegisterResponse } from "./auth.types";
import axios from "axios";

export function useRegisterMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthRegister>({
    mutationFn: register,
    onSuccess: (result, variables, onMutateResult, context) => {
      console.log(">>> result : ", result);
      // Invalidate the users query — this triggers a background refetch
      context.client.invalidateQueries({ queryKey: ["users"], exact: false });
      return result;
    },
    onError: (error) => {
      console.log(">>> error : ", error);
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        console.error("Register API error:", message);
      } else {
        console.error("Unexpected error:", error);
      }
    },
  });
}
