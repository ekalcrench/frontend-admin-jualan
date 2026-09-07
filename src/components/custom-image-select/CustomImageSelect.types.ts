import {
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  Control,
} from "react-hook-form";

export interface CustomImageSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  label?: string;
  disabled?: boolean;
  renderErrorMessage?: boolean;
}

export interface ImagePickerProps {
  value: unknown;
  onChange: (file: File | null) => void;
  inputRef: (element: HTMLInputElement | null) => void;
  disabled: boolean;
}
