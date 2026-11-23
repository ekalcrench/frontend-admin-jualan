import type { LabelValue } from "@/types/generalTypes";
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
  isActive: boolean;
}
