import { AutocompleteProps } from "@mui/material/Autocomplete";
import { BoxProps } from "@mui/material/Box";
import { TextFieldProps } from "@mui/material/TextField";
import {
  FieldErrors,
  FieldValues,
  UseControllerProps,
  UseFormTrigger,
} from "react-hook-form";

export interface AutocompletePropsBase<T = any> extends Omit<
  AutocompleteProps<
    T,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >,
  "renderInput"
> {}

interface ExtendedAutocompleteProps<TFieldValues extends FieldValues, Option> {
  // Required Props
  autocompleteProps: AutocompletePropsBase<Option>;
  placeholder: string;

  // Optional Props
  boxFieldWrapperProps?: BoxProps;
  disabled?: boolean;
  label?: string;
  overridOnChangeAutocomplete?: boolean;
  overridOnBlurAutocomplete?: boolean;
  renderErrorMessage?: boolean;
  required?: boolean;
  textFieldProps?: Omit<TextFieldProps, "required" | "disabled">;
  errors?: FieldErrors<TFieldValues>;
}

export type CustomAutocompleteProps<
  T extends FieldValues,
  Option,
> = UseControllerProps<T> & ExtendedAutocompleteProps<T, Option>;
