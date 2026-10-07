import { useMutation } from "@tanstack/react-query";
import { inventoryItemKeys } from "./inventoryItems.constants";
import {
  createInventoryItem,
  deleteInventoryItem,
  editInventoryItem,
} from "./inventoryItems.api";
import { CreateInventoryItem, EditInventoryItem } from "./inventoryItems.types";
import { InventoryItem } from "@/types/inventoryItem";

export function useCreateInventoryItemMutation() {
  return useMutation<InventoryItem, Error, CreateInventoryItem>({
    mutationFn: createInventoryItem,
    onSuccess: (result, payload, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists() });
    },
  });
}

export function useEditInventoryItemMutation() {
  return useMutation<InventoryItem, Error, EditInventoryItem>({
    mutationFn: editInventoryItem,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists() });
    },
  });
}

export function useDeleteInventoryItemMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteInventoryItem,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists() });
    },
  });
}
