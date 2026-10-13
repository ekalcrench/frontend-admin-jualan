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
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyInputLabel } from "@/styled/CustomTypography";
import useProductForm from "./ProductForm.hooks";
import type { ProductFormProps } from "./ProductForm.types";
import { emptyProductIngredient } from "./ProductForm.constants";

export default function ProductForm(props: ProductFormProps) {
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
  } = useProductForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableCloseOnOutsideInteraction
      title={props.id ? "Edit Produk" : "Tambah Produk"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          name="name"
          control={control}
          label="Nama Produk"
          placeholder="Contoh: Paket nasi ayam"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomInputNumber
          name="sellingPrice"
          control={control}
          label="Harga Jual"
          placeholder="25.000"
          startAdornment="Rp."
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
          <Typography sx={{ fontWeight: 600 }}>Bahan Produk</Typography>
        </Stack>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              <BoxFlexSpaceBetween>
                <TypographyInputLabel>{`Bahan ${index + 1}`}</TypographyInputLabel>
                <IconButton
                  aria-label={`Hapus bahan ${index + 1}`}
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
                name={`productIngredients.${index}.inventoryItemId`}
                placeholder="Ketik untuk mencari barang"
                renderErrorMessage
                disabled={isLoading}
                autocompleteProps={{
                  options: (inventoryItemOptions ?? []).map((item) => ({
                    label: `${item.name} (${inventoryUnitLabels[item.unit]})`,
                    value: item.id,
                  })),
                  // onInputChange: (_, value, reason) => {
                  //   if (reason === "input") setPrefix(value);
                  // },
                  loading: isLoadingGetOptions,
                }}
              />

              <Grid container columnSpacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  <CustomInputNumber
                    name={`productIngredients.${index}.quantity`}
                    control={control}
                    label="Jumlah"
                    placeholder="100 (Gram (g))"
                    // endAdornment={''}
                    renderErrorMessage
                    disabled={isLoading}
                  />
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
            onClick={() => append(emptyProductIngredient)}
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
          Simpan Produk
        </Button>
      </form>
    </FormDrawer>
  );
}
