import { BoxProps, TextFieldProps } from "@mui/material";
import { Control, FieldValues, Path } from "react-hook-form";

export type CustomInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  textFieldProps?: TextFieldProps;
  boxFieldWrapperProps?: BoxProps;
  renderErrorMessage?: boolean;
  numeric?: boolean;
};
