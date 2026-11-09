import { useMutation } from "@tanstack/react-query";
import { EditInventoryLot } from "./inventoryLots.types";
import { InventoryLotResponse } from "@/types/inventoryLot";
import { editInventoryLot } from "./inventoryLots.api";
import { inventoryItemKeys } from "../inventory-items/inventoryItems.constants";
import { inventoryLotKeys } from "./inventoryLots.constants";
import { inventoryTransactionKeys } from "../inventory-transactions/inventoryTransactions.constants";

export function useEditInventoryLotMutation() {
  return useMutation<InventoryLotResponse, Error, EditInventoryLot>({
    mutationFn: editInventoryLot,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: inventoryItemKeys.lists });
      context.client.invalidateQueries({ queryKey: inventoryLotKeys.lists });
      context.client.invalidateQueries({
        queryKey: inventoryTransactionKeys.lists,
      });
    },
  });
}
