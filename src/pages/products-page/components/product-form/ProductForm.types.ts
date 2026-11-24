import { LabelValue } from "@/types/generalTypes";
import type { InventoryItemOptions, InventoryPolicy } from "@/types/inventoryItem";
import type { ProductStockManagement } from "@/types/product";
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
  isActive: boolean;
  stockManagement: ProductStockManagement;
  inventoryPolicy: InventoryPolicy;
  stock: number | null;
  productIngredients: ProductIngredientFormValues[];
}
