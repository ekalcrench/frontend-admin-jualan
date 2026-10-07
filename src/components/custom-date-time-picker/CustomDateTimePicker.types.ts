import { FieldValues, UseControllerProps } from "react-hook-form";
import { BoxProps } from "@mui/material/Box";
import { DateTimePickerProps } from "@mui/x-date-pickers";
import { PickersTextFieldProps } from "@mui/x-date-pickers/PickersTextField";

export interface CustomDateTimePickerProps<
  Field extends FieldValues,
> extends UseControllerProps<Field> {
  boxFieldWrapperProps?: BoxProps;
  dateTimePickerProps?: DateTimePickerProps;
  textFieldProps?: PickersTextFieldProps;
  disabled?: boolean;
  label?: string;
  renderErrorMessage?: boolean;
  overrideOnChange?: boolean;
}
