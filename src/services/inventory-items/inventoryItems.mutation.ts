import { useMutation } from "@tanstack/react-query";
import { inventoryItemKeys } from "./inventoryItems.constants";
import {
  createInventoryItem,
  deleteInventoryItem,
  editInventoryItem,
} from "./inventoryItems.api";
import { CreateInventoryItem, EditInventoryItem } from "./inventoryItems.types";
import { InventoryItemResponse } from "@/types/inventoryItem";

export function useCreateInventoryItemMutation() {
  return useMutation<InventoryItemResponse, Error, CreateInventoryItem>({
    mutationFn: createInventoryItem,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists() });
      context.client.setQueryData(inventoryItemKeys.detail(result.id), result);
    },
  });
}

export function useEditInventoryItemMutation() {
  return useMutation<InventoryItemResponse, Error, EditInventoryItem>({
    mutationFn: editInventoryItem,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists() });
      context.client.setQueryData(inventoryItemKeys.detail(result.id), result);
    },
  });
}

export function useDeleteInventoryItemMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteInventoryItem,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.all });
    },
  });
}
