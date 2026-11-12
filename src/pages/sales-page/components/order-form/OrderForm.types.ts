import { LabelValue } from "@/types/generalTypes";
import { OrderType } from "@/types/order";
import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";

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
  type: OrderType | null;
  orderNumber: string;
  deliveryOrder: {
    deliveryFee: number | null;
    name: string;
    address: string;
    phone: string;
    latitude: number | null;
    longitude: number | null;
  };
  takeawayOrder: {
    name: string;
    phone: string;
    pickUpTime: string;
  };
  dineInOrder: {
    tableId: string;
    name: string;
    guestCount: number | null;
  };
  orderItems: OrderItemFormValues[];
}
