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
      context.client.setQueryData(ordersKeys.detail(result.id), result);
    },
  });
}
