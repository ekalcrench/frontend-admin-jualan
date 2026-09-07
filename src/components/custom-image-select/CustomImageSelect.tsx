import { Box, Button, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, FieldValues } from "react-hook-form";
import { BoxFieldWrapper } from "@/styled/CustomBox";
import {
  TypographyErrorInput,
  TypographyInputLabel,
} from "@/styled/CustomTypography";
import {
  CustomImageSelectProps,
  ImagePickerProps,
} from "./CustomImageSelect.types";

function ImagePicker({
  value,
  onChange,
  inputRef,
  disabled,
}: ImagePickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!(value instanceof File)) {
      setPreviewUrl(undefined);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  return (
    <Box>
      {previewUrl ? (
        <Box
          component="img"
          src={previewUrl}
          alt="Pratinjau foto UMKM"
          sx={{
            display: "block",
            width: "100%",
            maxHeight: "160px",
            objectFit: "contain",
            border: "1px solid",
            borderColor: "border.main",
            borderRadius: "12px",
            marginBottom: "20px",
            padding: "12px 20px",
          }}
        />
      ) : (
        <Typography
          color="text.secondary"
          sx={{ marginBottom: "24px", marginTop: "20px", textAlign: "center" }}
        >
          Belum ada gambar dipilih
        </Typography>
      )}

      <Button
        component="label"
        variant="outlined"
        disabled={disabled}
        fullWidth
      >
        {previewUrl ? "Ganti gambar" : "Pilih gambar"}
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
        />
      </Button>
    </Box>
  );
}

export default function CustomImageSelect<TFieldValues extends FieldValues>({
  control,
  errors,
  name,
  label,
  disabled = false,
  renderErrorMessage,
}: CustomImageSelectProps<TFieldValues>) {
  const error = errors?.[name];
  const errorMessage =
    typeof error?.message === "string" ? error.message : undefined;

  return (
    <BoxFieldWrapper renderErrorMessage={renderErrorMessage}>
      {label && <TypographyInputLabel>{label}</TypographyInputLabel>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <ImagePicker
            value={value}
            onChange={onChange}
            inputRef={ref}
            disabled={disabled}
          />
        )}
      />

      {renderErrorMessage && errorMessage && (
        <TypographyErrorInput color="error">
          {errorMessage}
        </TypographyErrorInput>
      )}
    </BoxFieldWrapper>
  );
}
