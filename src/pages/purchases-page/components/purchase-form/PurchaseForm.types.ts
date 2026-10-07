import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";
import { z } from "zod";
import { purchaseFormSchema } from "./PurchaseForm.constants";

export interface PurchaseFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  id?: string;
}

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;
