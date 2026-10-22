import { useMutation } from "@tanstack/react-query";
import { cashTransactionsKeys } from "./cashTransactions.constants";
import { CashTransactionResponse } from "@/types/cashTransaction";
import {
  createCashTransaction,
  editCashTransaction,
  deleteCashTransaction,
} from "./cashTransactions.api";
import {
  CreateCashTransaction,
  EditCashTransaction,
} from "./cashTransactions.types";

export function useCreateCashTransactionMutation() {
  return useMutation<CashTransactionResponse, Error, CreateCashTransaction>({
    mutationFn: createCashTransaction,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: cashTransactionsKeys.lists,
      });
      context.client.invalidateQueries({
        queryKey: cashTransactionsKeys.balances,
      });
      context.client.setQueryData(
        cashTransactionsKeys.detail(result.id),
        result,
      );
    },
  });
}

export function useEditCashTransactionMutation() {
  return useMutation<CashTransactionResponse, Error, EditCashTransaction>({
    mutationFn: editCashTransaction,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: cashTransactionsKeys.lists,
      });
      context.client.invalidateQueries({
        queryKey: cashTransactionsKeys.balances,
      });
      context.client.setQueryData(
        cashTransactionsKeys.detail(result.id),
        result,
      );
    },
  });
}

export function useDeleteCashTransactionMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteCashTransaction,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: cashTransactionsKeys.all });
    },
  });
}
