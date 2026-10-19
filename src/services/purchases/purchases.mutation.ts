import { useMutation } from "@tanstack/react-query";
import { purchasesKeys } from "./purchases.constants";
import { CreatePurchase, EditPurchase } from "./purchases.types";
import {
  createPurchase,
  deletePurchase,
  editPurchase,
  finalizePurchase,
} from "./purchases.api";
import { inventoryItemKeys } from "../inventory-items/inventoryItems.constants";
import { PurchaseResponse } from "@/types/purchase";
import { inventoryTransactionKeys } from "../inventory-transactions/inventoryTransactions.constants";

export function useCreatePurchaseMutation() {
  return useMutation<PurchaseResponse, Error, CreatePurchase>({
    mutationFn: createPurchase,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: purchasesKeys.lists() });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.all });
      context.client.setQueryData(purchasesKeys.detail(result.id), result);
    },
  });
}

export function useEditPurchaseMutation() {
  return useMutation<PurchaseResponse, Error, EditPurchase>({
    mutationFn: editPurchase,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: purchasesKeys.lists() });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.all });
      context.client.setQueryData(purchasesKeys.detail(result.id), result);
    },
  });
}

export function useDeletePurchaseMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deletePurchase,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: purchasesKeys.all });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.all });
      context.client.invalidateQueries({
        queryKey: inventoryTransactionKeys.all,
      });
    },
  });
}

export function useFinalizePurchaseMutation() {
  return useMutation<PurchaseResponse, Error, string>({
    mutationFn: finalizePurchase,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: inventoryTransactionKeys.lists(),
      });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists() });
      context.client.invalidateQueries({ queryKey: purchasesKeys.lists() });
      context.client.setQueryData(purchasesKeys.detail(result.id), result);
    },
  });
}
