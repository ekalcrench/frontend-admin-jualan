import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { FieldPath } from "react-hook-form";
import { UmkmFormProps, UmkmFormValues } from "./UmkmForm.types";
import FormDrawer from "@/components/form-drawer";
import useUmkmForm from "./UmkmForm.hooks";
import CustomInput from "@/components/custom-input";
import CustomAutocomplete from "@/components/custom-autocomplete";
import CustomImageSelect from "@/components/custom-image-select";
import { getImageDataUrl } from "@/utils/image";
import { BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyInputLabel } from "@/styled/CustomTypography";
import {
  socialMediaPlatformLabels,
  socialMediaPlatforms,
} from "@/constants/organization";
import { SocialMediaPlatform } from "@/types/organization";

const socialMediaFieldName = (
  index: number,
  field: "platform" | "username",
): FieldPath<UmkmFormValues> =>
  `socialMedias.${index}.${field}` as FieldPath<UmkmFormValues>;

export default function UmkmForm(props: UmkmFormProps) {
  const {
    control,
    isLoading,
    handleSubmit,
    onSubmit,
    socialMediaFields,
    isSocialMediaFull,
    handleClickAddSocialMedia,
    handleClickRemoveSocialMedia,
    logoBase64,
  } = useUmkmForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      title={`${props.id ? "Edit UMKM" : "Buat UMKM Baru"}`}
      formProps={{ onSubmit: handleSubmit(onSubmit) }}
      footer={
        <Button type="submit" variant="contained" fullWidth loading={isLoading}>
          Simpan
        </Button>
      }
    >
      <CustomInput
        name="name"
        control={control}
        label="Nama"
        placeholder="Nama UMKM (Contoh: Seblak Kang Uus)"
        renderErrorMessage
        disabled={isLoading}
      />

      <CustomInput
        name="username"
        control={control}
        label="Username"
        placeholder="Contoh: seblakkanguus"
        renderErrorMessage
        disabled={isLoading}
        textFieldProps={{
          slotProps: { htmlInput: { maxLength: 30 } },
        }}
      />

      <CustomInput
        name="email"
        control={control}
        label="Email"
        placeholder="contoh@gmail.com"
        renderErrorMessage
        disabled={isLoading}
      />

      <CustomInput
        name="phone"
        control={control}
        label="Nomor HP"
        placeholder="08976573345"
        renderErrorMessage
        disabled={isLoading}
        numeric
      />

      <CustomInput
        name="address"
        control={control}
        label="Alamat"
        placeholder="Contoh: Jl. Kemang Raya No. 10, RT 05/RW 02, Kec. Mampang Prapatan"
        renderErrorMessage
        disabled={isLoading}
        textFieldProps={{
          multiline: true,
          minRows: 3,
          maxRows: 5,
        }}
      />

      <CustomImageSelect
        name="file"
        control={control}
        label="Logo"
        renderErrorMessage
        disabled={isLoading}
        existingImageUrl={getImageDataUrl(logoBase64)}
      />

      <Box sx={{ marginTop: "20px" }}>
        <TypographyInputLabel>Media Sosial</TypographyInputLabel>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "16px" }}
        >
          Tambahkan akun media sosial UMKM{" "}
          <Typography
            component={"span"}
            variant="body2"
            sx={{ fontWeight: 600 }}
          >
            (opsional)
          </Typography>
        </Typography>

        <Stack spacing={2}>
          {socialMediaFields.map((socialMediaField, index) => (
            <Box
              key={socialMediaField.id}
              sx={{
                border: "1px solid",
                borderColor: "border.main",
                borderRadius: "12px",
                padding: "16px 16px 4px",
              }}
            >
              <BoxFlexSpaceBetween sx={{ marginBottom: "12px" }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Media Sosial {index + 1}
                </Typography>

                <IconButton
                  size="small"
                  color="error"
                  aria-label={`Hapus media sosial ${index + 1}`}
                  disabled={isLoading}
                  onClick={() => handleClickRemoveSocialMedia(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </BoxFlexSpaceBetween>

              <CustomAutocomplete
                name={socialMediaFieldName(index, "platform")}
                control={control}
                label="Platform"
                placeholder="Pilih platform"
                renderErrorMessage
                disabled={isLoading}
                autocompleteProps={{
                  options: socialMediaPlatforms,
                  disableClearable: true,
                  getOptionLabel: (platform) =>
                    socialMediaPlatformLabels[platform as SocialMediaPlatform],
                }}
              />

              <CustomInput
                name={socialMediaFieldName(index, "username")}
                control={control}
                label="Username"
                placeholder="Contoh: seblakkanguus"
                renderErrorMessage
                disabled={isLoading}
                textFieldProps={{
                  slotProps: { htmlInput: { maxLength: 30 } },
                }}
              />
            </Box>
          ))}
        </Stack>

        <BoxFlexEnd
          sx={{ marginTop: socialMediaFields.length ? "16px" : "0px" }}
        >
          <Button
            size="small"
            startIcon={<AddIcon />}
            disabled={isLoading || isSocialMediaFull}
            onClick={handleClickAddSocialMedia}
          >
            Tambah Media Sosial
          </Button>
        </BoxFlexEnd>
      </Box>
    </FormDrawer>
  );
}
