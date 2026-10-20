import { useMutation } from "@tanstack/react-query";
import { CreatePreparation, EditPreparation } from "./preparations.types";
import { preparationsKeys } from "./preparations.constants";
import {
  completePreparation,
  createPreparation,
  deletePreparation,
  editPreparation,
} from "./preparations.api";
import { PreparationResponse } from "@/types/preparations";
import { inventoryTransactionKeys } from "../inventory-transactions/inventoryTransactions.constants";
import { inventoryItemKeys } from "../inventory-items/inventoryItems.constants";
import { inventoryLotKeys } from "../inventory-lots/inventoryLots.constants";

export function useCreatePreparationMutation() {
  return useMutation<PreparationResponse, Error, CreatePreparation>({
    mutationFn: createPreparation,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: preparationsKeys.lists });
      context.client.setQueryData(preparationsKeys.detail(result.id), result);
    },
  });
}

export function useEditPreparationMutation() {
  return useMutation<PreparationResponse, Error, EditPreparation>({
    mutationFn: editPreparation,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: preparationsKeys.lists });
      context.client.setQueryData(preparationsKeys.detail(result.id), result);
    },
  });
}

export function useDeletePreparationMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deletePreparation,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: inventoryTransactionKeys.lists,
      });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists });
      context.client.invalidateQueries({ queryKey: inventoryLotKeys.lists });
      context.client.invalidateQueries({ queryKey: preparationsKeys.all });
    },
  });
}

export function useCompletePreparationMutation() {
  return useMutation<PreparationResponse, Error, string>({
    mutationFn: completePreparation,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: inventoryTransactionKeys.lists,
      });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists });
      context.client.invalidateQueries({ queryKey: inventoryLotKeys.lists });
      context.client.invalidateQueries({ queryKey: preparationsKeys.lists });
      context.client.setQueryData(preparationsKeys.detail(result.id), result);
    },
  });
}
