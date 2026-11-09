import type { InventoryLotResponse } from "@/types/inventoryLot";
import type { SwipeableDrawerProps } from "@mui/material";
import type { Dispatch } from "react";

export interface InventoryLotFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  lot: InventoryLotResponse;
}

export interface InventoryLotFormValues {
  remainingQuantity: number | null;
  receivedAt: string;
  expiredAt: string;
}
