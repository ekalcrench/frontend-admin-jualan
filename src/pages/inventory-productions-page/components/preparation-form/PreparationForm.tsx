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
import CustomAutocomplete from "@/components/custom-autocomplete";
import CustomDateTimePicker from "@/components/custom-date-time-picker";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { numberFormat } from "@/utils/number";
import usePreparationForm from "./PreparationForm.hooks";
import { PreparationFormProps } from "./PreparationForm.types";
import CustomCheckbox from "@/components/custom-checkbox";

export default function PreparationForm(props: PreparationFormProps) {
  const {
    control,
    emptyPreparationItem,
    fields,
    inventoryItemOptions,
    preparationItemsValues,
    outputInventoryItemUnit,
    preparationItemInventoryUnits,
    isHasNoExpired,
    isLoading,
    isLoadingGetOptions,
    append,
    handleRemovePreparationItem,
    handleSubmit,
    onSubmit,
  } = usePreparationForm(props);

  const itemOptions = (inventoryItemOptions ?? []).map((item) => ({
    label: `${item.name} (${inventoryUnitLabels[item.unit]})`,
    value: item.id,
  }));

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableCloseOnOutsideInteraction
      title={props.id ? "Edit Produksi" : "Tambah Produksi"}
      formProps={{ onSubmit: handleSubmit(onSubmit) }}
      footer={
        <Button type="submit" variant="contained" fullWidth loading={isLoading}>
          Simpan Draft
        </Button>
      }
      size="large"
    >
      <CustomInput
        name="name"
        control={control}
        label="Nama Produksi"
        placeholder="Contoh: Adonan roti"
        renderErrorMessage
        disabled={isLoading}
      />

      <Grid container columnSpacing={1.5}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <CustomAutocomplete
            control={control}
            name="outputInventoryItemId"
            label="Barang Hasil Produksi"
            placeholder="Pilih barang hasil"
            renderErrorMessage
            disabled={isLoading}
            autocompleteProps={{
              options: itemOptions,
              loading: isLoadingGetOptions,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomInputNumber
            name="outputQuantity"
            control={control}
            label="Jumlah"
            placeholder="Contoh: 30"
            endAdornment={
              outputInventoryItemUnit
                ? inventoryUnitLabels[outputInventoryItemUnit]
                : undefined
            }
            renderErrorMessage
            disabled={isLoading}
          />
        </Grid>
      </Grid>

      <CustomDateTimePicker
        control={control}
        name="preparedAt"
        label="Tanggal Produksi"
        renderErrorMessage
        disabled={isLoading}
      />

      <Box>
        <Typography sx={{ marginBottom: "4px" }}>
          Tanggal Kedaluwarsa
        </Typography>
        <CustomCheckbox
          control={control}
          name="isHasNoExpired"
          label="Tidak memiliki tanggal kedaluwarsa"
          disabled={isLoading}
          boxFieldWrapperProps={{
            sx: {
              marginBottom: isHasNoExpired ? "16px" : 0,
            },
          }}
        />
        {!isHasNoExpired && (
          <CustomDateTimePicker
            control={control}
            name="expiredAt"
            renderErrorMessage
            disabled={isLoading}
          />
        )}
      </Box>

      <CustomInput
        name="notes"
        control={control}
        label="Cara Produksi (Optional)"
        placeholder="Step by step produksi"
        renderErrorMessage
        disabled={isLoading}
        textFieldProps={{ multiline: true, minRows: 2 }}
      />

      <Divider sx={{ marginTop: "8px", marginBottom: "24px" }} />

      <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
        Bahan Produksi
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: "16px" }}
      >
        Atur bahan dengan tepat untuk mengetahui HPP produksi.
      </Typography>
      <Stack spacing={2}>
        {fields.map((field, index) => {
          const selectedInventoryItemUnit =
            preparationItemInventoryUnits[index];
          const selectedInventoryItemId =
            preparationItemsValues?.[index]?.inventoryItemId?.value;
          const selectedInventoryItem = inventoryItemOptions?.find(
            (item) => item.id === selectedInventoryItemId,
          );
          const selectedQuantity = preparationItemsValues?.[index]?.quantity;
          const hasInsufficientStock =
            selectedInventoryItem &&
            typeof selectedQuantity === "number" &&
            selectedQuantity > selectedInventoryItem.stock;

          return (
            <Box
              key={field.id}
              sx={{
                border: "1px solid",
                borderColor: hasInsufficientStock ? "error.main" : "divider",
                borderRadius: "16px",
                padding: "12px 16px",
              }}
            >
              <BoxFlexSpaceBetween sx={{ marginBottom: "12px" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >{`Bahan ke-${index + 1}`}</Typography>
                <IconButton
                  aria-label={`Hapus bahan ${index + 1}`}
                  color="error"
                  disabled={isLoading || fields.length === 1}
                  onClick={() => handleRemovePreparationItem(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </BoxFlexSpaceBetween>

              <Grid container columnSpacing={1.5}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <CustomAutocomplete
                    label="Nama"
                    boxFieldWrapperProps={{ sx: { flex: 1 } }}
                    control={control}
                    name={`preparationItems.${index}.inventoryItemId`}
                    placeholder="Ketik untuk mencari barang"
                    renderErrorMessage
                    disabled={isLoading}
                    autocompleteProps={{
                      options: itemOptions,
                      loading: isLoadingGetOptions,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomInputNumber
                    name={`preparationItems.${index}.quantity`}
                    control={control}
                    label="Jumlah"
                    placeholder="Contoh: 30"
                    endAdornment={
                      selectedInventoryItemUnit
                        ? inventoryUnitLabels[selectedInventoryItemUnit]
                        : undefined
                    }
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
                <Grid size={12}>
                  <BoxFlexSpaceBetween>
                    <Typography variant="body2">Stok Bahan</Typography>
                    <Typography variant="body2">
                      {selectedInventoryItem
                        ? `${numberFormat.format(selectedInventoryItem.stock)}${
                            selectedInventoryItemUnit
                              ? ` ${inventoryUnitLabels[selectedInventoryItemUnit]}`
                              : ""
                          }`
                        : "-"}
                    </Typography>
                  </BoxFlexSpaceBetween>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Stack>

      <BoxFlexEnd sx={{ marginTop: "16px" }}>
        <Button
          size="small"
          startIcon={<AddIcon />}
          disabled={isLoading}
          onClick={() => append({ ...emptyPreparationItem })}
        >
          Tambah Bahan
        </Button>
      </BoxFlexEnd>
    </FormDrawer>
  );
}
