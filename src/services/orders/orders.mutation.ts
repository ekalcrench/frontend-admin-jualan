import { CreateOrder, EditOrder, OrderResponse } from "@/types/order";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { ordersKeys } from "./orders.constants";
import {
  createOrder,
  deleteOrder,
  editOrder,
  markPaidOrder,
} from "./orders.api";
import { productsKeys } from "../products/products.constants";
import { inventoryItemKeys } from "../inventory-items/inventoryItems.constants";
import { inventoryLotKeys } from "../inventory-lots/inventoryLots.constants";
import { inventoryTransactionKeys } from "../inventory-transactions/inventoryTransactions.constants";
import { cashTransactionsKeys } from "../cash-transactions/cashTransactions.constants";

function invalidateOrderMutationQueries(client: QueryClient) {
  const queryKeys = [
    ...(client
      ? [ordersKeys.lists, ordersKeys.overviews, ordersKeys.overviewItems]
      : [ordersKeys.all]),
    productsKeys.lists,
    inventoryItemKeys.lists,
    inventoryItemKeys.optionsWithStock,
    inventoryLotKeys.lists,
    inventoryTransactionKeys.lists,
  ] as const;

  queryKeys.forEach((queryKey) => client.invalidateQueries({ queryKey }));
}

function invalidateCashTransactionQueries(client: QueryClient) {
  [cashTransactionsKeys.lists, cashTransactionsKeys.balances].forEach(
    (queryKey) => client.invalidateQueries({ queryKey }),
  );
}

export function useCreateOrderMutation() {
  return useMutation<OrderResponse, Error, CreateOrder>({
    mutationFn: createOrder,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      invalidateOrderMutationQueries(context.client);
      context.client.setQueryData(ordersKeys.detail(result.id), result);
    },
  });
}

export function useEditOrderMutation() {
  return useMutation<OrderResponse, Error, EditOrder>({
    mutationFn: editOrder,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      invalidateOrderMutationQueries(context.client);
      context.client.setQueryData(ordersKeys.detail(result.id), result);
    },
  });
}

export function useDeleteOrderMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteOrder,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      invalidateOrderMutationQueries(context.client);
    },
  });
}

export function useMarkPaidOrderMutation() {
  return useMutation<OrderResponse, Error, string>({
    mutationFn: markPaidOrder,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ordersKeys.lists });
      invalidateCashTransactionQueries(context.client);
      context.client.setQueryData(ordersKeys.detail(result.id), result);
    },
  });
}
