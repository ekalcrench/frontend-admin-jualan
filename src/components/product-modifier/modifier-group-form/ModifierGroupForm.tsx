import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import CustomCheckbox from "@/components/custom-checkbox";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import useModifierGroupForm from "./ModifierGroupForm.hooks";
import type { ModifierGroupFormProps } from "./ModifierGroupForm.types";

export default function ModifierGroupForm(props: ModifierGroupFormProps) {
  const {
    control,
    isMultiple,
    isRequired,
    maxSelection,
    isLoading,
    handleSubmit,
    onSubmit,
  } = useModifierGroupForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableCloseOnOutsideInteraction
      title={props.group ? "Edit Grup Variasi" : "Tambah Grup Variasi"}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CustomInput
          name="name"
          control={control}
          label="Nama Grup Variasi"
          placeholder="Contoh: Extra Isian"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomInput
          name="description"
          control={control}
          label="Deskripsi (opsional)"
          placeholder="Contoh: Tambahan isian untuk menu soto"
          renderErrorMessage
          disabled={isLoading}
          textFieldProps={{
            multiline: true,
            minRows: 3,
            slotProps: {
              input: {
                sx: {
                  height: "auto",
                  padding: "12px 14px",
                },
              },
            },
          }}
        />

        <Divider sx={{ marginTop: "8px", marginBottom: "20px" }} />

        <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
          Aturan Pilihan
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "16px" }}
        >
          Tentukan bagaimana pelanggan memilih variasi saat memesan produk.
        </Typography>

        <CustomCheckbox
          name="isRequired"
          control={control}
          label="Wajib dipilih pelanggan"
          disabled={isLoading}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginLeft: "32px", marginBottom: "12px" }}
        >
          Pelanggan harus memilih minimal satu opsi dari grup ini.
        </Typography>

        <CustomCheckbox
          name="isMultiple"
          control={control}
          label="Izinkan pilihan ganda"
          disabled={isLoading}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginLeft: "32px", marginBottom: "16px" }}
        >
          Pelanggan dapat memilih lebih dari satu opsi dari grup ini.
        </Typography>

        <Grid container columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputNumber
              name="minSelection"
              control={control}
              label="Jumlah Minimum"
              placeholder="0"
              allowNegative={false}
              decimalScale={0}
              renderErrorMessage
              disabled={isLoading || !isMultiple}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputNumber
              name="maxSelection"
              control={control}
              label="Jumlah Maksimum"
              placeholder="1"
              allowNegative={false}
              decimalScale={0}
              renderErrorMessage
              disabled={isLoading || !isMultiple}
            />
          </Grid>
        </Grid>

        <Box sx={{ marginTop: "4px", marginBottom: "20px" }}>
          <Typography variant="body2" color="text.secondary">
            {isMultiple
              ? isRequired
                ? "Jumlah minimum minimal 1 karena grup ini wajib dipilih. Jumlah maksimum harus sama atau lebih besar dari minimum."
                : "Atur berapa opsi paling sedikit dan paling banyak yang boleh dipilih pelanggan."
              : "Pilihan tunggal otomatis menggunakan minimum 0 (atau 1 bila wajib) dan maksimum 1 opsi. Aktifkan pilihan ganda untuk mengatur jumlah minimum dan maksimum."}
          </Typography>
          {isMultiple && maxSelection === 1 && (
            <Typography variant="body2" color="text.secondary">
              Untuk mengizinkan lebih dari satu pilihan, atur jumlah maksimum
              minimal 2.
            </Typography>
          )}
        </Box>

        <Divider sx={{ marginBottom: "20px" }} />

        <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
          Status
        </Typography>
        <CustomCheckbox
          name="isActive"
          control={control}
          label="Grup variasi aktif"
          disabled={isLoading}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginLeft: "32px", marginBottom: "24px" }}
        >
          Grup nonaktif tidak akan muncul saat pelanggan memesan produk.
        </Typography>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          {props.group ? "Simpan Perubahan" : "Simpan Grup Variasi"}
        </Button>
      </form>
    </FormDrawer>
  );
}
