import type { LabelValue } from "@/types/generalTypes";
import type { InventoryPolicy } from "@/types/inventoryItem";
import type { ProductModifierOptionResponse } from "@/types/productModifier";
import type { SwipeableDrawerProps } from "@mui/material";
import type { Dispatch } from "react";

export interface OptionFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  modifierGroupId: string;
  nextSortOrder: number;
  option?: ProductModifierOptionResponse;
}

export interface OptionFormValues {
  name: string;
  description: string;
  price: number | null;
  inventoryItemId: LabelValue<string> | null;
  inventoryQuantity: number | null;
  trackInventory: boolean;
  inventoryPolicy: InventoryPolicy;
  isActive: boolean;
}
