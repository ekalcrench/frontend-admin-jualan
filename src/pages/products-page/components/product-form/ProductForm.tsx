import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CustomAutocomplete from "@/components/custom-autocomplete";
import CustomCheckbox from "@/components/custom-checkbox";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyInputLabel } from "@/styled/CustomTypography";
import useProductForm from "./ProductForm.hooks";
import type { ProductFormProps } from "./ProductForm.types";
import { emptyProductIngredient } from "./ProductForm.constants";
import ProductModifierSection from "./components/product-modifier-section";

export default function ProductForm(props: ProductFormProps) {
  const {
    control,
    fields,
    stockManagement,
    handleStockManagementChange,
    inventoryItemOptions,
    isLoading,
    isLoadingGetOptions,
    modifierGroupOptions,
    selectedModifierGroupIds,
    canManage,
    isModifierGroupsLoading,
    isModifierGroupsError,
    append,
    refetchModifierGroups,
    handleRemoveProductIngredient,
    handleModifierGroupChange,
    handleSubmit,
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

        <CustomCheckbox
          name="isActive"
          control={control}
          label="Produk aktif"
          disabled={isLoading}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginLeft: "32px", marginBottom: "20px" }}
        >
          Produk nonaktif tidak akan muncul saat membuat pesanan baru. Riwayat
          transaksi yang sudah ada tetap tersedia.
        </Typography>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
            Manajemen Persediaan
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            Pilih bagaimana stok produk dikelola. Konfigurasi bahan tetap
            tersedia untuk perhitungan HPP, terlepas dari pilihan ini.
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <Typography component="legend" variant="subtitle2">
              Manajemen Stok
            </Typography>
            <Controller
              name="stockManagement"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onChange={(event, value) => {
                    field.onChange(value);
                    handleStockManagementChange(value);
                  }}
                >
                    <FormControlLabel
                      value="UNTRACKED"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2">
                            Tidak dilacak (stok tidak terbatas)
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Stok produk tidak dibatasi dan tidak dikurangi dari
                            bahan persediaan.
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="MANUAL"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2">
                            Stok manual
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Atur jumlah stok produk sendiri.
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="INVENTORY"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2">
                            Berdasarkan bahan persediaan
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Stok produk dihitung dari jumlah bahan yang
                            tersedia.
                          </Typography>
                        </Box>
                      }
                    />
                </RadioGroup>
              )}
            />
          </FormControl>

          {stockManagement === "MANUAL" && (
            <CustomInputNumber
              name="stock"
              control={control}
              label="Jumlah Stok"
              placeholder="Contoh: 10"
              decimalScale={0}
              renderErrorMessage
              disabled={isLoading}
            />
          )}

          {stockManagement === "INVENTORY" && (
            <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
              <Typography component="legend" variant="subtitle2">
                Kebijakan Stok
              </Typography>
              <Controller
                name="inventoryPolicy"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value="STRICT"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2">Strict (ketat)</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cegah penjualan saat stok bahan tidak mencukupi.
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="ALLOW_NEGATIVE"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2">
                            Allow negative (izinkan stok negatif)
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Izinkan penjualan meski stok bahan tidak
                            mencukupi.
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          )}
        </Box>

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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          Atur bahan untuk perhitungan HPP. Bahan tetap dapat digunakan untuk
          menghitung biaya tanpa mengaktifkan pengurangan stok otomatis.
        </Typography>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {fields.map((field, index) => (
            <Box key={field.id}>
              <BoxFlexSpaceBetween>
                <TypographyInputLabel>{`Bahan ${index + 1}`}</TypographyInputLabel>
                <IconButton
                  aria-label={`Hapus bahan ${index + 1}`}
                  color="error"
                  disabled={isLoading}
                  onClick={() => handleRemoveProductIngredient(index)}
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

        <Divider sx={{ marginTop: "24px", marginBottom: "24px" }} />

        <ProductModifierSection
          options={modifierGroupOptions}
          selectedIds={selectedModifierGroupIds}
          onChange={handleModifierGroupChange}
          isLoading={isModifierGroupsLoading}
          isError={isModifierGroupsError}
          onRetry={refetchModifierGroups}
          disabled={!canManage || isLoading}
        />

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
