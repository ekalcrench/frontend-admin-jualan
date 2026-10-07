import { TextField } from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { CustomInputProps } from "./CustomInput.types";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import {
  TypographyErrorInput,
  TypographyInputLabel,
} from "@/styled/CustomTypography";
import { Fragment } from "react/jsx-runtime";

export default function CustomInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  boxFieldWrapperProps,
  renderErrorMessage,
  textFieldProps,
  numeric,
}: CustomInputProps<TFieldValues>) {
  return (
    <BoxFieldWrapper
      {...boxFieldWrapperProps}
      renderErrorMessage={renderErrorMessage}
    >
      {label &&
        (typeof label === "string" ? (
          <TypographyInputLabel>{label}</TypographyInputLabel>
        ) : (
          label
        ))}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const errorMessage =
            typeof fieldState.error?.message === "string"
              ? fieldState.error.message
              : undefined;

          return (
            <Fragment>
              <TextField
                {...field}
                {...textFieldProps}
                onKeyDown={(e) => {
                  const regex = new RegExp(
                    /[0-9]|(Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)/,
                  );
                  const inputNonNumeric = !e.key.match(regex);
                  if (numeric && inputNonNumeric) e.preventDefault();

                  textFieldProps?.onKeyDown?.(e);
                }}
                fullWidth
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                error={Boolean(errorMessage)}
              />

              {renderErrorMessage && Boolean(errorMessage) && (
                <TypographyErrorInput color="error">
                  {errorMessage}
                </TypographyErrorInput>
              )}
            </Fragment>
          );
        }}
      />
    </BoxFieldWrapper>
  );
}
