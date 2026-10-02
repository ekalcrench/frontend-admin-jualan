import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";
import { InventoryItemByPages } from "@/types/inventoryItem";

export interface InventoryItemFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  item?: InventoryItemByPages;
}
