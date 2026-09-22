import { SwipeableDrawerProps } from "@mui/material";
import z from "zod";
import { umkmFormSchema } from "./UmkmForm.constants";
import { Dispatch } from "react";
import { Organization } from "@/types/organization";

export interface UmkmFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  onSuccess?: (organization: Organization) => void;
  id?: string;
}

export type UmkmFormValues = z.infer<typeof umkmFormSchema>;
