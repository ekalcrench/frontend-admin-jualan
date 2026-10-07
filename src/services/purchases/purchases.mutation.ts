import { useMutation } from "@tanstack/react-query";
import { purchasesKeys } from "./purchases.constants";
import {
  CreatePurchase,
  EditPurchase,
  PurchaseResponse,
} from "./purchases.types";
import { createPurchase, deletePurchase, editPurchase } from "./purchases.api";
import { inventoryItemKeys } from "../inventory-items/inventoryItems.constants";

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
      context.client.invalidateQueries({ queryKey: purchasesKeys.lists() });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.all });
    },
  });
}
