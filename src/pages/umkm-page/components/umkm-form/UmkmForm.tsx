import { Button } from "@mui/material";
import { UmkmFormProps } from "./UmkmForm.types";
import { FormDrawer } from "@/components/form-drawer";
import useUmkmForm from "./UmkmForm.hooks";
import { CustomInput } from "@/components/custom-input";
import { CustomImageSelect } from "@/components/custom-image-select";

export default function UmkmForm(props: UmkmFormProps) {
  const { control, errors, isLoading, handleSubmit, onSubmit } =
    useUmkmForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      title="Buat UMKM Baru"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          name="name"
          control={control}
          errors={errors}
          label="Nama"
          placeholder="Nama UMKM (Contoh: Seblak Kang Uus)"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomInput
          name="email"
          control={control}
          errors={errors}
          label="Email"
          placeholder="contoh@gmail.com"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomInput
          name="phone"
          control={control}
          errors={errors}
          label="Nomor HP"
          placeholder="08976573345"
          renderErrorMessage
          disabled={isLoading}
          numeric
        />

        <CustomInput
          name="address"
          control={control}
          errors={errors}
          label="Alamat"
          placeholder="Contoh: Jl. Kemang Raya No. 10, RT 05/RW 02, Kec. Mampang Prapatan"
          renderErrorMessage
          disabled={isLoading}
          textFieldProps={{
            multiline: true,
            minRows: 3,
            maxRows: 5,
            sx: {
              "& .MuiInputBase-root": {
                padding: "0px !important",
              },
              "& .MuiInputBase-input": {
                paddingTop: "12px",
                paddingBottom: "12px",
              },
            },
          }}
        />

        <CustomImageSelect
          name="file"
          control={control}
          errors={errors}
          label="Logo"
          renderErrorMessage
          disabled={isLoading}
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
