import { BoxProps, TextFieldProps } from "@mui/material";
import { ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { NumericFormatProps } from "react-number-format";

export type CustomInputNumberProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  startAdornment?: ReactNode;
  disabled?: boolean;
  textFieldProps?: TextFieldProps;
  boxFieldWrapperProps?: BoxProps;
  renderErrorMessage?: boolean;
} & Omit<
  NumericFormatProps,
  | keyof TextFieldProps
  | "customInput"
  | "defaultValue"
  | "disabled"
  | "getInputRef"
  | "name"
  | "onBlur"
  | "onChange"
  | "type"
  | "onValueChange"
  | "value"
>;
