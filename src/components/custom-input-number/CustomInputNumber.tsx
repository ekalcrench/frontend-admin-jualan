import { InputAdornment, TextField } from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import {
  TypographyErrorInput,
  TypographyInputLabel,
} from "@/styled/CustomTypography";
import { Fragment } from "react/jsx-runtime";
import { CustomInputNumberProps } from "./CustomInputNumber.types";
import { ReactNode } from "react";

type NumericTextFieldProps = React.ComponentProps<typeof TextField> & {
  startAdornment?: ReactNode;
};

function NumericTextField({
  startAdornment,
  slotProps,
  ...textFieldProps
}: NumericTextFieldProps) {
  return (
    <TextField
      {...textFieldProps}
      slotProps={{
        ...slotProps,
        input: {
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}

export default function CustomInputNumber<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  startAdornment,
  disabled = false,
  boxFieldWrapperProps,
  renderErrorMessage,
  textFieldProps,
  ...numberFormatProps
}: CustomInputNumberProps<TFieldValues>) {
  return (
    <BoxFieldWrapper
      {...boxFieldWrapperProps}
      renderErrorMessage={renderErrorMessage}
    >
      {label && <TypographyInputLabel>{label}</TypographyInputLabel>}

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
              <NumericFormat
                {...numberFormatProps}
                customInput={NumericTextField}
                startAdornment={startAdornment}
                thousandSeparator="."
                decimalSeparator=","
                getInputRef={field.ref}
                name={field.name}
                value={field.value ?? null}
                onValueChange={({ floatValue }) =>
                  field.onChange(floatValue ?? null)
                }
                onBlur={field.onBlur}
                fullWidth
                placeholder={placeholder}
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
