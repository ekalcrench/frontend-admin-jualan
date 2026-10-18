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
import CustomCheckbox from "@/components/custom-checkbox";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import usePurchaseForm from "./PurchaseForm.hooks";
import { PurchaseFormProps } from "./PurchaseForm.types";
import CustomDateTimePicker from "@/components/custom-date-time-picker";
import { emptyPurchaseItem } from "./PurchaseForm.constants";
import CustomAutocomplete from "@/components/custom-autocomplete";
import { BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyInputLabel } from "@/styled/CustomTypography";
import { inventoryUnitLabels } from "@/constants/inventoryItem";

export default function PurchaseForm(props: PurchaseFormProps) {
  const {
    control,
    fields,
    inventoryItemOptions,
    purchaseItemsValues,
    isLoading,
    isLoadingGetOptions,
    append,
    handleRemovePurchaseItem,
    handleSubmit,
    onSubmit,
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
                  onClick={() => handleRemovePurchaseItem(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </BoxFlexSpaceBetween>

              <CustomAutocomplete
                control={control}
                name={`purchaseItems.${index}.inventoryItemId`}
                placeholder="Pilih barang"
                renderErrorMessage
                disabled={isLoading}
                autocompleteProps={{
                  options: (inventoryItemOptions ?? []).map((item) => ({
                    label: `${item.name} (${inventoryUnitLabels[item.unit]})`,
                    value: item.id,
                  })),
                  loading: isLoadingGetOptions,
                }}
              />

              <Grid container columnSpacing={1.5}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <CustomInputNumber
                    name={`purchaseItems.${index}.quantity`}
                    control={control}
                    label="Jumlah"
                    placeholder="2"
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <CustomInputNumber
                    name={`purchaseItems.${index}.packageSize`}
                    control={control}
                    label="Ukuran"
                    placeholder="500 (Gram (g))"
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <CustomInputNumber
                    name={`purchaseItems.${index}.totalCost`}
                    control={control}
                    label="Total Harga"
                    placeholder="99.000"
                    startAdornment="Rp."
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography sx={{ marginBottom: "4px" }}>
                    Tanggal Diterima
                  </Typography>
                  <CustomCheckbox
                    control={control}
                    name={`purchaseItems.${index}.isSameAsPurchaseAt`}
                    label="Sama dengan tanggal pembelian"
                    disabled={isLoading}
                    boxFieldWrapperProps={{
                      sx: {
                        marginBottom: purchaseItemsValues?.[index]
                          ?.isSameAsPurchaseAt
                          ? "16px"
                          : 0,
                      },
                    }}
                  />
                  {!purchaseItemsValues?.[index]?.isSameAsPurchaseAt && (
                    <CustomDateTimePicker
                      control={control}
                      name={`purchaseItems.${index}.receivedAt`}
                      renderErrorMessage
                      disabled={isLoading}
                    />
                  )}
                </Grid>
                <Grid size={12}>
                  <Typography sx={{ marginBottom: "4px" }}>
                    Tanggal Kedaluwarsa
                  </Typography>
                  <CustomCheckbox
                    control={control}
                    name={`purchaseItems.${index}.isHasNoExpired`}
                    label="Tidak memiliki tanggal kedaluwarsa"
                    disabled={isLoading}
                    boxFieldWrapperProps={{
                      sx: {
                        marginBottom: purchaseItemsValues?.[index]
                          ?.isHasNoExpired
                          ? "16px"
                          : 0,
                      },
                    }}
                  />
                  {!purchaseItemsValues?.[index]?.isHasNoExpired && (
                    <CustomDateTimePicker
                      control={control}
                      name={`purchaseItems.${index}.expiredAt`}
                      renderErrorMessage
                      disabled={isLoading}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>

        <BoxFlexEnd>
          <Button
            size="small"
            startIcon={<AddIcon />}
            disabled={isLoading}
            onClick={() => append(emptyPurchaseItem)}
          >
            Tambah Barang
          </Button>
        </BoxFlexEnd>

        <Button
          sx={{ mt: "32px" }}
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
