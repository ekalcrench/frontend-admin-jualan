import { useMutation } from "@tanstack/react-query";
import {
  login,
  loginOrganization,
  logout,
  register,
  registerVerify,
  resendOtp,
} from "./auth.api";
import { userKeys } from "../users/users.constants";
import { cashTransactionsKeys } from "../cash-transactions/cashTransactions.constants";
import { inventoryItemKeys } from "../inventory-items/inventoryItems.constants";
import { inventoryLotKeys } from "../inventory-lots/inventoryLots.constants";
import { inventoryTransactionKeys } from "../inventory-transactions/inventoryTransactions.constants";
import { ordersKeys } from "../orders/orders.constants";
import { organizationUserKeys } from "../organization-users/organizationUsers.constants";
import { preparationsKeys } from "../preparations/preparations.constants";
import { productsKeys } from "../products/products.constants";
import { purchasesKeys } from "../purchases/purchases.constants";
import {
  AuthLoginResponse,
  AuthLogin,
  AuthLoginOrganizationResponse,
  AuthLoginOrganization,
  AuthRegisterResponse,
  AuthRegister,
  AuthRegisterVerify,
  AuthResendOtpResponse,
  AuthResendOtp,
} from "@/types/auth";

export function useLoginMutation() {
  return useMutation<AuthLoginResponse, Error, AuthLogin>({
    mutationFn: login,
  });
}

export function useLoginOrganizationMutation() {
  return useMutation<
    AuthLoginOrganizationResponse,
    Error,
    AuthLoginOrganization
  >({
    mutationFn: loginOrganization,
  });
}

export function useRegisterMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthRegister>({
    mutationFn: register,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: userKeys.email(result.email),
      });
    },
  });
}

export function useRegisterVerifyMutation() {
  return useMutation<AuthRegisterResponse, Error, AuthRegisterVerify>({
    mutationFn: registerVerify,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: userKeys.email(result.email),
      });
    },
  });
}

export function useResendOtpMutation() {
  return useMutation<AuthResendOtpResponse, Error, AuthResendOtp>({
    mutationFn: resendOtp,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: userKeys.email(result.user.email),
      });
    },
  });
}

export function useLogoutMutation() {
  return useMutation<boolean, Error, undefined>({
    mutationFn: logout,
    onSuccess: (result, variables, onMutateResult, context) => {
      context.client.removeQueries({ queryKey: cashTransactionsKeys.all });
      context.client.removeQueries({ queryKey: inventoryItemKeys.all });
      context.client.removeQueries({ queryKey: inventoryLotKeys.all });
      context.client.removeQueries({ queryKey: inventoryTransactionKeys.all });
      context.client.removeQueries({ queryKey: ordersKeys.all });
      context.client.removeQueries({ queryKey: organizationUserKeys.all });
      context.client.removeQueries({ queryKey: preparationsKeys.all });
      context.client.removeQueries({ queryKey: productsKeys.all });
      context.client.removeQueries({ queryKey: purchasesKeys.all });
    },
  });
}
