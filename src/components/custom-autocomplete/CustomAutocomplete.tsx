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
        render={({ field }) => {
          const { onChange, value, ...restField } = field;

          return (
            <Autocomplete
              options={options}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                  {...params}
                  {...textFieldProps}
                  id={name}
                  placeholder={placeholder}
                  error={Boolean(errorMessage)}
                  variant="outlined"
                  disabled={disabled}
                  required={required}
                  fullWidth
                />
              )}
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
              disabled={disabled}
              openOnFocus
              value={(value as Option | Option[]) ?? null}
              defaultValue={(value as Option | Option[]) ?? null}
            />
          );
        }}
        defaultValue={defaultValue}
        {...rest}
      />

      {renderErrorMessage && Boolean(errorMessage) && (
        <TypographyErrorInput color="error">
          {errorMessage}
        </TypographyErrorInput>
      )}
    </BoxFieldWrapper>
  );
}
