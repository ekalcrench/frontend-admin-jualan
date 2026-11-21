import type { ProductModifierGroupResponse } from "@/types/productModifier";
import type { SwipeableDrawerProps } from "@mui/material";
import type { Dispatch } from "react";

export interface ModifierGroupFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  group?: ProductModifierGroupResponse;
}

export interface ModifierGroupFormValues {
  name: string;
  description: string;
  isRequired: boolean;
  isMultiple: boolean;
  minSelection: number | null;
  maxSelection: number | null;
  isActive: boolean;
}
