import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import usePurchaseForm from "./PurchaseForm.hooks";
import { PurchaseFormProps } from "./PurchaseForm.types";
import CustomDateTimePicker from "@/components/custom-date-time-picker";
import { emptyPurchaseItem } from "./PurchaseForm.constants";
import CustomAutocomplete from "@/components/custom-autocomplete";
import { BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyInputLabel } from "@/styled/CustomTypography";

export default function PurchaseForm(props: PurchaseFormProps) {
  const {
    control,
    fields,
    inventoryItemOptions,
    isLoading,
    isLoadingGetOptions,
    append,
    handleSubmit,
    remove,
    onSubmit,
    setPrefix,
  } = usePurchaseForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableCloseOnOutsideInteraction
      title={props.id ? "Edit Pembelian" : "Tambah Pembelian"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          name="supplierName"
          control={control}
          label="Nama Supplier"
          placeholder="Contoh: Yogya Toserba"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomInput
          name="invoiceNumber"
          control={control}
          label="Nomor Invoice"
          placeholder="Contoh: INV-001"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomDateTimePicker
          control={control}
          name="purchasedAt"
          label="Tanggal Pembelian"
          renderErrorMessage
          disabled={isLoading}
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
          <Typography sx={{ fontWeight: 600 }}>Barang Pembelian</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            disabled={isLoading}
            onClick={() => append(emptyPurchaseItem)}
          >
            Tambah Barang
          </Button>
        </Stack>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              <BoxFlexSpaceBetween>
                <TypographyInputLabel>{`Barang ${index + 1}`}</TypographyInputLabel>
                <IconButton
                  aria-label={`Hapus barang ${index + 1}`}
                  color="error"
                  disabled={isLoading || fields.length === 1}
                  onClick={() => remove(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </BoxFlexSpaceBetween>

              <CustomAutocomplete
                boxFieldWrapperProps={{ sx: { flex: 1 } }}
                control={control}
                name={`purchaseItems.${index}.inventoryItemId`}
                placeholder="Ketik untuk mencari barang"
                renderErrorMessage
                disabled={isLoading}
                autocompleteProps={{
                  options: (inventoryItemOptions ?? []).map((item) => ({
                    label: `${item.name} (${item.unit})`,
                    value: item.id,
                  })),
                  onInputChange: (_, value, reason) => {
                    if (reason === "input") setPrefix(value);
                  },
                  loading: isLoadingGetOptions,
                }}
              />

              <Grid container columnSpacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomInputNumber
                    name={`purchaseItems.${index}.quantity`}
                    control={control}
                    label="Jumlah"
                    placeholder="500 (Gram (g))"
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomInputNumber
                    name={`purchaseItems.${index}.unitCost`}
                    control={control}
                    label="Harga"
                    placeholder="99.000"
                    startAdornment="Rp."
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomDateTimePicker
                    control={control}
                    name={`purchaseItems.${index}.receivedAt`}
                    label="Tanggal Diterima"
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomDateTimePicker
                    control={control}
                    name={`purchaseItems.${index}.expiredAt`}
                    label="Tanggal Kedaluwarsa"
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>

        <Button
          sx={{ mt: 1 }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          Simpan Pembelian
        </Button>
      </form>
    </FormDrawer>
  );
}
