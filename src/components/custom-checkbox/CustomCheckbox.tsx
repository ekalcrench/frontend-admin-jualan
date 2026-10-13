import { Checkbox, FormControlLabel } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { Controller, FieldValues } from "react-hook-form";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import { TypographyErrorInput } from "@/styled/CustomTypography";
import { CustomCheckboxProps } from "./CustomCheckbox.types";

export default function CustomCheckbox<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  checkboxProps,
  boxFieldWrapperProps,
  renderErrorMessage,
}: CustomCheckboxProps<TFieldValues>) {
  return (
    <BoxFieldWrapper
      {...boxFieldWrapperProps}
      renderErrorMessage={renderErrorMessage}
    >
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
              <FormControlLabel
                control={
                  <Checkbox
                    {...checkboxProps}
                    checked={field.value === true}
                    name={field.name}
                    slotProps={{ input: { ref: field.ref } }}
                    onBlur={field.onBlur}
                    onChange={(_, checked) => field.onChange(checked)}
                    disabled={disabled}
                    color={errorMessage ? "error" : checkboxProps?.color}
                  />
                }
                label={label}
              />

              {renderErrorMessage && errorMessage && (
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
