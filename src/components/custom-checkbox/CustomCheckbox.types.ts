import { BoxProps, CheckboxProps } from "@mui/material";
import { ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type CustomCheckboxProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: ReactNode;
  disabled?: boolean;
  checkboxProps?: Omit<
    CheckboxProps,
    "checked" | "defaultChecked" | "name" | "onChange" | "value"
  >;
  boxFieldWrapperProps?: BoxProps;
  renderErrorMessage?: boolean;
};
