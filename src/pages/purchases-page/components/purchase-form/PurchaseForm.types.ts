import { LabelValue } from "@/types/generalTypes";
import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";

export interface PurchaseFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  id?: string;
}

export interface PurchaseItemFormValues {
  inventoryItemId: LabelValue<string> | null;
  quantity: number | null;
  unitCost: number | null;
  receivedAt: string;
  expiredAt: string | undefined;
}

export interface PurchaseFormValues {
  supplierName: string;
  invoiceNumber: string;
  purchasedAt: string;
  purchaseItems: PurchaseItemFormValues[];
}
