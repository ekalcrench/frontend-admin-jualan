import type { FormHTMLAttributes, ReactNode } from "react";
import { SwipeableDrawerProps } from "@mui/material";

export type FormDrawerSize = "small" | "medium" | "large";

export interface FormDrawerProps extends SwipeableDrawerProps {
  title: string;
  disableCloseOnOutsideInteraction?: boolean;
  size?: FormDrawerSize;
  formProps?: FormHTMLAttributes<HTMLFormElement>;
  footer?: ReactNode;
}
