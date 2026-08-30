import { BoxProps } from "@mui/material/Box";
import { TextFieldProps } from "@mui/material/TextField";
import {
  FieldValues,
  UseControllerProps,
  UseFormTrigger,
} from "react-hook-form";
import { OTPInputProps } from "react-otp-input";

interface ExtendedOtpProps<T extends FieldValues> {
  // Required Props
  otpProps?: OTPInputProps;

  // Optional Props
  boxFieldWrapperProps?: BoxProps;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  renderErrorMessage?: boolean;
  textFieldProps?: Omit<
    TextFieldProps,
    "required" | "disabled" | "renderInput"
  >;

  /**
   * please pass this trigger from `useForm`
   * if the field is a required field to auto validate using yup
   * schema. This will be used in `onBlur` method if the field is marked
   * as required. So, when user move from the required field, the error message
   * will appear to the user and you (as the dev) don't have to manually
   * apply it whenever you want to create a required input
   */
  trigger?: UseFormTrigger<T>;
}

export type CustomOtpProps<T extends FieldValues> = UseControllerProps<T> &
  ExtendedOtpProps<T>;
