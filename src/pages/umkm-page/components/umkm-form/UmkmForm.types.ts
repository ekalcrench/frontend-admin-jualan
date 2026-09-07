import { SwipeableDrawerProps } from "@mui/material";
import z from "zod";
import { umkmFormSchema } from "./UmkmForm.constants";
import { Dispatch } from "react";

export interface UmkmFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
}

export type UmkmFormValues = z.infer<typeof umkmFormSchema>;
