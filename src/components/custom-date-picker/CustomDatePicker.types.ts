import { FieldValues, UseControllerProps } from "react-hook-form";
import { BoxProps } from "@mui/material/Box";
import { DatePickerProps } from "@mui/x-date-pickers";
import { PickersTextFieldProps } from "@mui/x-date-pickers/PickersTextField";

export interface CustomDatePickerProps<
  Field extends FieldValues,
> extends UseControllerProps<Field> {
  boxFieldWrapperProps?: BoxProps;
  datePickerProps?: DatePickerProps;
  textFieldProps?: PickersTextFieldProps;
  disabled?: boolean;
  label?: string;
  renderErrorMessage?: boolean;
  overrideOnChange?: boolean;
}
