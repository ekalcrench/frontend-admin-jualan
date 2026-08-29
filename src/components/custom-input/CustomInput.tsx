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
  errors,
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  boxFieldWrapperProps,
  renderErrorMessage,
}: CustomInputProps<TFieldValues>) {
  const error = errors?.[name];
  const errorMessage =
    typeof error?.message === "string" ? error.message : undefined;

  console.log(">>> error : ", error);
  console.log(">>> errorMessage : ", errorMessage);

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
        render={({ field }) => (
          <Fragment>
            <TextField
              {...field}
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
        )}
      />
    </BoxFieldWrapper>
  );
}
