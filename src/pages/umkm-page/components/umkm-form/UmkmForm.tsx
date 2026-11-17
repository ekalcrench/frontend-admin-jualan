import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { UmkmFormProps } from "./UmkmForm.types";
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
import { emptySocialMediaFormValues } from "./UmkmForm.constants";

export default function UmkmForm(props: UmkmFormProps) {
  const {
    control,
    fields,
    append,
    remove,
    isLoading,
    handleSubmit,
    onSubmit,
    logoBase64,
  } = useUmkmForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      title={`${props.id ? "Edit UMKM" : "Buat UMKM Baru"}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            marginTop: "8px",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Sosial Media</Typography>
        </Stack>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              <BoxFlexSpaceBetween>
                <TypographyInputLabel>{`Sosial Media ${index + 1}`}</TypographyInputLabel>
                <IconButton
                  aria-label={`Hapus sosial media ${index + 1}`}
                  color="error"
                  disabled={isLoading}
                  onClick={() => remove(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </BoxFlexSpaceBetween>

              <CustomAutocomplete
                control={control}
                name={`socialMedias.${index}.platform`}
                placeholder="Pilih platform sosial media"
                renderErrorMessage
                disabled={isLoading}
                autocompleteProps={{
                  options: socialMediaPlatforms.map((platform) => ({
                    label: socialMediaPlatformLabels[platform],
                    value: platform,
                  })),
                }}
              />

              <CustomInput
                name={`socialMedias.${index}.username`}
                control={control}
                label="Username"
                placeholder="Contoh: @seblakkanguus"
                renderErrorMessage
                disabled={isLoading}
              />
            </Box>
          ))}
        </Stack>

        <BoxFlexEnd>
          <Button
            size="small"
            startIcon={<AddIcon />}
            disabled={isLoading}
            onClick={() => append({ ...emptySocialMediaFormValues })}
          >
            Tambah Sosial Media
          </Button>
        </BoxFlexEnd>

        <CustomImageSelect
          name="file"
          control={control}
          label="Logo"
          renderErrorMessage
          disabled={isLoading}
          existingImageUrl={getImageDataUrl(logoBase64)}
        />

        <Button
          sx={{ marginTop: "20px" }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          Simpan
        </Button>
      </form>
    </FormDrawer>
  );
}
