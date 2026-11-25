import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CustomAutocomplete from "@/components/custom-autocomplete";
import CustomCheckbox from "@/components/custom-checkbox";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import type { LabelValue } from "@/types/generalTypes";
import useModifierOptionForm from "./ModifierOptionForm.hooks";
import type { OptionFormProps } from "./ModifierOptionForm.types";

export default function ModifierOptionForm(props: OptionFormProps) {
  const {
    control,
    isLoading,
    isLoadingInventoryItems,
    isInventoryItemsEmpty,
    inventoryItemOptions,
    hasSelectedInventoryItem,
    trackInventory,
    selectedInventoryItemUnit,
    handleInventoryItemChange,
    handleSubmit,
    onSubmit,
  } = useModifierOptionForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableCloseOnOutsideInteraction
      title={props.option ? "Edit Opsi Variasi" : "Tambah Opsi Variasi"}
      formProps={{ onSubmit: handleSubmit(onSubmit), noValidate: true }}
      footer={
        <Button type="submit" variant="contained" fullWidth loading={isLoading}>
          {props.option ? "Simpan Perubahan" : "Simpan Opsi"}
        </Button>
      }
    >
        <CustomInput
          name="name"
          control={control}
          label="Nama Opsi"
          placeholder="Contoh: Ayam Suwir"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomInput
          name="description"
          control={control}
          label="Deskripsi (opsional)"
          placeholder="Contoh: Ayam suwir pedas"
          renderErrorMessage
          disabled={isLoading}
          textFieldProps={{
            multiline: true,
            minRows: 2,
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

        <CustomInputNumber
          name="price"
          control={control}
          label="Harga Tambahan"
          placeholder="0"
          startAdornment="Rp."
          allowNegative={false}
          decimalScale={2}
          renderErrorMessage
          disabled={isLoading}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginTop: "4px", marginBottom: "20px" }}
        >
          Biaya tambahan yang dikenakan saat pelanggan memilih opsi ini. Isi 0
          untuk opsi gratis.
        </Typography>

        <Divider sx={{ marginBottom: "20px" }} />

        <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
          Pemakaian Persediaan (opsional)
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "16px" }}
        >
          Hubungkan barang persediaan untuk menghitung biaya bahan. Aktifkan
          pelacakan untuk otomatis mengurangi stok saat opsi ini dipilih.
        </Typography>

        <CustomAutocomplete
          control={control}
          name="inventoryItemId"
          label="Barang Persediaan"
          placeholder="Pilih barang persediaan"
          renderErrorMessage
          disabled={isLoading}
          autocompleteProps={{
            options: inventoryItemOptions,
            loading: isLoadingInventoryItems,
            loadingText: "Memuat barang persediaan...",
            isOptionEqualToValue: (option, value) =>
              (option as LabelValue<string>).value ===
              (value as LabelValue<string>).value,
            noOptionsText: "Barang persediaan tidak ditemukan",
            onChange: (_event, value) => {
              handleInventoryItemChange(value as LabelValue<string> | null);
            },
          }}
        />

        {hasSelectedInventoryItem && (
          <>
            <CustomInputNumber
              name="inventoryQuantity"
              control={control}
              label="Jumlah Persediaan"
              placeholder="Contoh: 30"
              allowNegative={false}
              decimalScale={2}
              endAdornment={
                selectedInventoryItemUnit
                  ? inventoryUnitLabels[selectedInventoryItemUnit]
                  : undefined
              }
              renderErrorMessage
              disabled={isLoading}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: "4px", marginBottom: "12px" }}
            >
              Jumlah ini digunakan untuk menghitung biaya bahan. Stok hanya
              dikurangi jika pelacakan bahan diaktifkan.
            </Typography>
          </>
        )}

        {isInventoryItemsEmpty ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: "4px", marginBottom: "20px" }}
          >
            Belum ada barang persediaan aktif. Tambahkan barang persediaan
            terlebih dahulu jika opsi ini menggunakan bahan persediaan.
          </Typography>
        ) : !hasSelectedInventoryItem ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: "4px", marginBottom: "20px" }}
          >
            Pilih barang persediaan untuk menghitung biaya bahan dan mengatur
            pengurangan stok opsional.
          </Typography>
        ) : null}

        {hasSelectedInventoryItem && (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              padding: 2,
              marginBottom: 2,
            }}
          >
            <CustomCheckbox
              name="trackInventory"
              control={control}
              label="Aktifkan pelacakan bahan"
              disabled={isLoading}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginLeft: "32px", marginBottom: 1 }}
            >
              Otomatis kurangi bahan ini dari persediaan saat opsi dipilih.
            </Typography>

            {trackInventory && (
              <FormControl component="fieldset" fullWidth>
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
                              Cegah penjualan saat stok bahan opsi ini tidak
                              mencukupi.
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
                              Izinkan penjualan meski stok bahan opsi ini tidak
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
        )}

        <Divider sx={{ marginBottom: "20px" }} />

        <CustomCheckbox
          name="isActive"
          control={control}
          label="Opsi aktif"
          disabled={isLoading}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginLeft: "32px", marginBottom: "24px" }}
        >
          Opsi nonaktif tidak akan muncul saat pelanggan memesan produk.
        </Typography>

    </FormDrawer>
  );
}
