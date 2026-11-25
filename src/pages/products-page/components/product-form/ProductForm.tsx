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
import ProductModifierSection from "../product-modifier-section";

export default function ProductForm(props: ProductFormProps) {
  const {
    control,
    fields,
    stockManagement,
    handleStockManagementChange,
    inventoryItemOptions,
    productIngredientInventoryUnits,
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
      formProps={{ onSubmit: handleSubmit(onSubmit) }}
      footer={
        <Button type="submit" variant="contained" fullWidth loading={isLoading}>
          Simpan Produk
        </Button>
      }
    >
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
          Produk nonaktif tidak akan muncul saat membuat pesanan baru
        </Typography>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
            Manajemen Stok
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: "8px" }}
          >
            Pilih bagaimana stok produk dikelola
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <Controller
              name="stockManagement"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onChange={(_event, value) => {
                    field.onChange(value);
                    handleStockManagementChange(value);
                  }}
                >
                  <FormControlLabel
                    value="UNTRACKED"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2">Selalu tersedia</Typography>
                    }
                  />
                  <FormControlLabel
                    value="MANUAL"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2">Atur sendiri</Typography>
                    }
                  />
                  <FormControlLabel
                    value="INVENTORY"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2">
                        Diatur berdasarkan jumlah bahan
                      </Typography>
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
              boxFieldWrapperProps={{ sx: { marginTop: "8px" } }}
            />
          )}

          {stockManagement === "INVENTORY" && (
            <FormControl
              component="fieldset"
              fullWidth
              sx={{ marginTop: "12px" }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, marginBottom: "12px" }}
              >
                Pengaturan:
              </Typography>
              <Controller
                name="inventoryPolicy"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} sx={{ gap: "8px" }}>
                    <FormControlLabel
                      value="STRICT"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                            Ketat
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cegah penjualan saat stok bahan tidak mencukupi
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="ALLOW_NEGATIVE"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                            Longgar
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Izinkan penjualan meski stok bahan tidak mencukupi
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

        <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
          Bahan Produk
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          Atur bahan untuk perhitungan HPP. Jika manajemen stok diatur
          berdasarkan jumlah bahan, maka stok bahan akan berkurang secara
          otomatis.
        </Typography>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {fields.map((field, index) => {
            const selectedInventoryItemUnit =
              productIngredientInventoryUnits[index];

            return (
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
                    loading: isLoadingGetOptions,
                  }}
                />

                <Grid container columnSpacing={1.5}>
                  <Grid size={{ xs: 12 }}>
                    <CustomInputNumber
                      name={`productIngredients.${index}.quantity`}
                      control={control}
                      label="Jumlah Bahan"
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
                </Grid>
              </Box>
            );
          })}
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

    </FormDrawer>
  );
}
