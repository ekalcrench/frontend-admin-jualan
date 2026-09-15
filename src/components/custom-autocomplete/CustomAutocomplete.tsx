import { Fragment } from "react";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { Controller, FieldValues } from "react-hook-form";
import { AutocompleteGroupHeader } from "./CustomAutocomplete.styles";
import { CustomAutocompleteProps } from "./CustomAutocomplete.types";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import {
  TypographyErrorInput,
  TypographyInputLabel,
} from "@/styled/CustomTypography";
import { TextField } from "@mui/material";

export default function CustomAutocomplete<Field extends FieldValues, Option>({
  // Required Props
  placeholder,
  autocompleteProps,

  // Optional Props
  boxFieldWrapperProps,
  label,
  disabled,
  overridOnChangeAutocomplete,
  overridOnBlurAutocomplete,
  renderErrorMessage,
  required,
  textFieldProps,
  errors,

  // Controller Props
  name,
  control,
  defaultValue,
  ...rest
}: CustomAutocompleteProps<Field, Option>) {
  const { options, ...restAutocompleteProps } = autocompleteProps;

  const error = errors?.[name];
  const errorMessage =
    typeof error?.message === "string" ? error.message : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { onChange, value, ...restField } = field;

        const isMulti = autocompleteProps?.multiple;

        return (
          <Autocomplete
            options={options}
            renderInput={(params: AutocompleteRenderInputParams) => {
              return (
                <BoxFieldWrapper
                  {...boxFieldWrapperProps}
                  renderErrorMessage={renderErrorMessage}
                >
                  {label && (
                    <TypographyInputLabel>{label}</TypographyInputLabel>
                  )}

                  <TextField
                    {...params}
                    // InputProps={{ ...params.InputProps }}
                    id={name}
                    placeholder={placeholder}
                    error={Boolean(errorMessage)}
                    {...textFieldProps}
                    variant="outlined"
                    disabled={disabled}
                    required={required}
                    hiddenLabel
                    // isMultiAutocomplete={
                    //   value && value?.length > 0 && isMulti ? true : false
                    // }
                  />

                  {renderErrorMessage && Boolean(errorMessage) && (
                    <TypographyErrorInput color="error">
                      {errorMessage}
                    </TypographyErrorInput>
                  )}
                </BoxFieldWrapper>
              );
            }}
            renderGroup={(params) => (
              <Fragment key={params.key}>
                <AutocompleteGroupHeader>
                  {params.group}
                </AutocompleteGroupHeader>
                {params.children}
              </Fragment>
            )}
            {...restAutocompleteProps}
            onChange={(event, data, reason, details) => {
              if (typeof restAutocompleteProps.onChange === "function") {
                restAutocompleteProps.onChange(event, data, reason, details);

                if (overridOnChangeAutocomplete) return;
              }
              onChange(data);

              return data;
            }}
            {...restField}
            // onBlur={(event) => {
            //   if (typeof restAutocompleteProps.onBlur === "function") {
            //     restAutocompleteProps.onBlur(event);

            //     if (overridOnBlurAutocomplete) return;
            //   }

            //   // trigger yup schema validation
            //   if (typeof trigger !== "function") return;

            //   trigger(name);
            // }}
            disabled={disabled}
            openOnFocus
            // disableCloseOnSelect={
            //   restAutocompleteProps.disableCloseOnSelect !== undefined
            //     ? restAutocompleteProps.disableCloseOnSelect
            //     : restAutocompleteProps.multiple
            // }
            value={(value as Option | Option[]) ?? null}
            defaultValue={(value as Option | Option[]) ?? null}
            // blurOnSelect={
            //   restAutocompleteProps.blurOnSelect !== undefined
            //     ? restAutocompleteProps.blurOnSelect
            //     : !restAutocompleteProps.multiple
            // }
          />
        );
      }}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}
