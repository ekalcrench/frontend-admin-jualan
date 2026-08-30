import { useRef } from "react";

import { Controller, FieldValues } from "react-hook-form";
import OtpInput from "react-otp-input";

// import { BoxFieldWrapper, CustomLabel, CustomTextField } from "@/styles";
import { CustomOtpProps } from "./CustomOtp.types";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import { TextField } from "@mui/material";
import { TypographyInputLabel } from "@/styled/CustomTypography";

export default function CustomAutocomplete<Field extends FieldValues>({
  // Required Props
  otpProps,

  // Optional Props
  boxFieldWrapperProps,
  label,
  disabled,
  renderErrorMessage,
  required,
  textFieldProps,
  trigger,

  // Controller Props
  name,
  control,
  defaultValue,
  ...rest
}: CustomOtpProps<Field>) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { onChange, value } = field;

        const isError = !!fieldState.error;

        const handlePaste: React.ClipboardEventHandler = (event) => {
          const data = event.clipboardData.getData("text");
          onChange(data);
        };

        return (
          <BoxFieldWrapper
            {...boxFieldWrapperProps}
            renderErrorMessage={renderErrorMessage}
          >
            {label && <TypographyInputLabel>{label}</TypographyInputLabel>}

            <OtpInput
              {...otpProps}
              containerStyle={{ gap: "16px" }}
              value={value}
              onChange={(otp) => {
                const currentLength = otp ? otp.length : 0;
                if (inputRefs.current[currentLength]) {
                  inputRefs.current[currentLength]?.focus();
                }
                onChange(otp);
              }}
              onPaste={handlePaste}
              numInputs={6}
              renderInput={(props, index) => (
                <TextField
                  {...props} // Pass all props from OtpInput to the TextField
                  inputRef={(el) => (inputRefs.current[index] = el)} // Assign input ref
                  error={isError}
                  {...textFieldProps} // Apply additional props from textFieldProps
                  variant="outlined"
                  disabled={disabled}
                  required={required}
                  hiddenLabel
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      inputRefs.current[index]?.value === "" &&
                      index > 0
                    ) {
                      inputRefs.current[index - 1]?.focus(); // Move to previous input
                      const newOtp = value.split("");
                      newOtp[index - 1] = ""; // Clear previous input value
                      onChange(newOtp.join(""));
                    }
                  }}
                  sx={{
                    width: "100% !important",
                    "& input": {
                      paddingLeft: "0px !important",
                      paddingRight: "0px !important",
                      textAlign: "center",
                    },
                  }}
                  // inputProps={{ style: { textAlign: "center" } }}
                />
              )}
              inputType="tel"
              shouldAutoFocus
            />
          </BoxFieldWrapper>
        );
      }}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}
