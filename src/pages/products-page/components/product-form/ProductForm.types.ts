import { LabelValue } from "@/types/generalTypes";
import type { InventoryItemOptions } from "@/types/inventoryItem";
import type { SwipeableDrawerProps } from "@mui/material";
import type { Dispatch } from "react";

export interface ProductFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  id?: string;
}

export interface ProductIngredientFormValues {
  id?: string;
  inventoryItemId: LabelValue | null;
  quantity: number | null;
}

export interface ProductFormValues {
  name: string;
  sellingPrice: number | null;
  productIngredients: ProductIngredientFormValues[];
}
