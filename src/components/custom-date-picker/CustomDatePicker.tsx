import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FieldValues, useController } from "react-hook-form";
import dayjs from "dayjs";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import {
  TypographyErrorInput,
  TypographyInputLabel,
} from "@/styled/CustomTypography";
import { CustomDatePickerProps } from "./CustomDatePicker.types";
import "dayjs/locale/id";
import { DatePickerStyled } from "./CustomDatePicker.styles";

export default function CustomDatePicker<Field extends FieldValues>({
  // Props
  boxFieldWrapperProps,
  datePickerProps,
  textFieldProps,
  disabled,
  label,
  renderErrorMessage,
  overrideOnChange,

  // Controller Props
  name,
  control,
  ...rest
}: CustomDatePickerProps<Field>) {
  const { field, fieldState } = useController({
    name,
    control,
    ...rest,
  });

  const isError = !!fieldState.error;
  const errorMessage =
    typeof fieldState.error?.message === "string"
      ? fieldState.error.message
      : undefined;
  const pickerValue = field.value ? dayjs(field.value) : null;
  const pickerTextFieldSlotProps = datePickerProps?.slotProps?.textField;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <BoxFieldWrapper
        {...boxFieldWrapperProps}
        renderErrorMessage={renderErrorMessage}
      >
        {label && <TypographyInputLabel>{label}</TypographyInputLabel>}
        <DatePickerStyled
          {...datePickerProps}
          value={pickerValue}
          onChange={(value, context) => {
            if (typeof datePickerProps?.onChange === "function") {
              datePickerProps.onChange(value, context);

              if (overrideOnChange) return;
            }

            field.onChange(value?.toISOString() ?? "");
          }}
          slotProps={{
            ...datePickerProps?.slotProps,
            textField: (ownerState) => ({
              ...(typeof pickerTextFieldSlotProps === "function"
                ? pickerTextFieldSlotProps(ownerState)
                : pickerTextFieldSlotProps),
              ...textFieldProps,
              error: isError,
              fullWidth: true,
            }),
          }}
          disabled={disabled}
          isError={isError}
        />
        {renderErrorMessage && errorMessage && (
          <TypographyErrorInput color="error">
            {errorMessage}
          </TypographyErrorInput>
        )}
      </BoxFieldWrapper>
    </LocalizationProvider>
  );
}
