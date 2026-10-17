import type { LabelValue } from "@/types/generalTypes";
import type { SwipeableDrawerProps } from "@mui/material";
import type { Dispatch } from "react";

export interface OrderFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  id?: string;
}

export interface OrderItemFormValues {
  id?: string;
  productId: LabelValue<string> | null;
  quantity: number | null;
}

export interface OrderFormValues {
  orderNumber: string;
  orderItems: OrderItemFormValues[];
}
