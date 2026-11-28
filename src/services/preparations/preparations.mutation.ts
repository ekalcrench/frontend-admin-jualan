import { QueryClient, useMutation } from "@tanstack/react-query";
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
import { productsKeys } from "../products/products.constants";
import { ordersKeys } from "../orders/orders.constants";

function invalidatePreparationMutationQueries(client: QueryClient) {
  const queryKeys = [
    inventoryTransactionKeys.lists,
    inventoryItemKeys.lists,
    inventoryItemKeys.optionsWithStock,
    inventoryLotKeys.lists,
    preparationsKeys.lists,
    productsKeys.lists,
    ordersKeys.lists,
  ] as const;

  queryKeys.forEach((queryKey) => client.invalidateQueries({ queryKey }));
}

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
      invalidatePreparationMutationQueries(context.client);
    },
  });
}

export function useCompletePreparationMutation() {
  return useMutation<PreparationResponse, Error, string>({
    mutationFn: completePreparation,
    onSuccess: (result, payload, onMutateResult, context) => {
      invalidatePreparationMutationQueries(context.client);
      context.client.setQueryData(preparationsKeys.detail(result.id), result);
    },
  });
}
