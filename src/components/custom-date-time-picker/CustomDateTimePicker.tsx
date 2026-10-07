import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FieldValues, useController } from "react-hook-form";
import dayjs from "dayjs";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import {
  TypographyErrorInput,
  TypographyInputLabel,
} from "@/styled/CustomTypography";
import { CustomDateTimePickerProps } from "./CustomDateTimePicker.types";
import "dayjs/locale/id";
import { DateTimePickerStyled } from "./CustomDateTimePicker.styles";

export default function CustomDateTimePicker<Field extends FieldValues>({
  // Props
  boxFieldWrapperProps,
  dateTimePickerProps,
  textFieldProps,
  disabled,
  label,
  renderErrorMessage,
  overrideOnChange,

  // Controller Props
  name,
  control,
  ...rest
}: CustomDateTimePickerProps<Field>) {
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
  const pickerTextFieldSlotProps = dateTimePickerProps?.slotProps?.textField;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <BoxFieldWrapper
        {...boxFieldWrapperProps}
        renderErrorMessage={renderErrorMessage}
      >
        {label && <TypographyInputLabel>{label}</TypographyInputLabel>}
        <DateTimePickerStyled
          {...dateTimePickerProps}
          value={pickerValue}
          onChange={(value, context) => {
            if (typeof dateTimePickerProps?.onChange === "function") {
              dateTimePickerProps.onChange(value, context);

              if (overrideOnChange) return;
            }

            field.onChange(value?.toISOString() ?? "");
          }}
          slotProps={{
            ...dateTimePickerProps?.slotProps,
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
