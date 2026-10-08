import { InventoryItemResponse } from "@/types/inventoryItem";
import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";

export interface InventoryItemFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  item?: InventoryItemResponse;
}
