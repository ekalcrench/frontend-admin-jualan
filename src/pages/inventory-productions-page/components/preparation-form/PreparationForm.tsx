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
import { BoxCenter, BoxFlexEnd } from "@/styled/CustomBox";
import usePreparationForm from "./PreparationForm.hooks";
import { PreparationFormProps } from "./PreparationForm.types";
import CustomCheckbox from "@/components/custom-checkbox";

export default function PreparationForm(props: PreparationFormProps) {
  const {
    control,
    emptyPreparationItem,
    fields,
    inventoryItemOptions,
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
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          name="name"
          control={control}
          label="Nama Produksi"
          placeholder="Contoh: Adonan roti"
          renderErrorMessage
          disabled={isLoading}
        />

        <Grid container columnSpacing={1.5}>
          <Grid size={{ xs: 12, sm: 9 }}>
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
          <Grid size={{ xs: 12, sm: 3 }}>
            <CustomInputNumber
              name="outputQuantity"
              control={control}
              label="Jumlah"
              placeholder="500 (gr)"
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
          label="Cara Produksi"
          placeholder="Step by step produksi (optional)"
          renderErrorMessage
          disabled={isLoading}
          textFieldProps={{ multiline: true, minRows: 2 }}
        />

        <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
          Bahan Produksi
        </Typography>
        <Stack spacing={2} divider={<Divider flexItem />}>
          {fields.map((field, index) => (
            <Grid container columnSpacing={1.5} rowSpacing={0} key={field.id}>
              <Grid size={8}>
                <CustomAutocomplete
                  control={control}
                  label={`Bahan ${index + 1}`}
                  name={`preparationItems.${index}.inventoryItemId`}
                  placeholder="Pilih bahan persediaan"
                  renderErrorMessage
                  disabled={isLoading}
                  autocompleteProps={{
                    options: itemOptions,
                    loading: isLoadingGetOptions,
                  }}
                />
              </Grid>
              <Grid size={3}>
                <CustomInputNumber
                  name={`preparationItems.${index}.quantity`}
                  control={control}
                  label="Jumlah"
                  placeholder="20 gr"
                  renderErrorMessage
                  disabled={isLoading}
                />
              </Grid>
              <Grid size={1}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    height: "100%",
                    paddingBottom: "20px",
                    boxSizing: "border-box",
                  }}
                >
                  <BoxCenter sx={{ height: "54px" }}>
                    <IconButton
                      aria-label={`Hapus bahan ${index + 1}`}
                      color="error"
                      disabled={isLoading || fields.length === 1}
                      onClick={() => handleRemovePreparationItem(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </BoxCenter>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Stack>

        <BoxFlexEnd>
          <Button
            size="small"
            startIcon={<AddIcon />}
            disabled={isLoading}
            onClick={() => append({ ...emptyPreparationItem })}
          >
            Tambah Bahan
          </Button>
        </BoxFlexEnd>

        <Button
          sx={{ mt: "32px" }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          Simpan Produksi
        </Button>
      </form>
    </FormDrawer>
  );
}
