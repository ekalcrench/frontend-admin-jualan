import { OrderResponse } from "@/types/order";
import { useMutation } from "@tanstack/react-query";
import { CreateOrder, EditOrder } from "./orders.types";
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

export function useCreateOrderMutation() {
  return useMutation<OrderResponse, Error, CreateOrder>({
    mutationFn: createOrder,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ordersKeys.lists });
      context.client.setQueryData(ordersKeys.detail(result.id), result);
    },
  });
}

export function useEditOrderMutation() {
  return useMutation<OrderResponse, Error, EditOrder>({
    mutationFn: editOrder,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ordersKeys.lists });
      context.client.setQueryData(ordersKeys.detail(result.id), result);
    },
  });
}

export function useDeleteOrderMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteOrder,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useMarkPaidOrderMutation() {
  return useMutation<OrderResponse, Error, string>({
    mutationFn: markPaidOrder,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ordersKeys.lists });
      context.client.invalidateQueries({ queryKey: productsKeys.lists });
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists });
      context.client.invalidateQueries({ queryKey: inventoryLotKeys.lists });
      context.client.invalidateQueries({
        queryKey: inventoryTransactionKeys.lists,
      });
      context.client.setQueryData(ordersKeys.detail(result.id), result);
    },
  });
}
