import { Button, Divider, Typography } from "@mui/material";
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
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          Tentukan barang persediaan yang berkurang setiap kali pelanggan
          memilih opsi ini.
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

        <CustomInputNumber
          name="inventoryQuantity"
          control={control}
          label="Jumlah Persediaan"
          placeholder={
            hasSelectedInventoryItem
              ? "Contoh: 30"
              : "Pilih barang terlebih dahulu"
          }
          allowNegative={false}
          decimalScale={2}
          endAdornment={
            selectedInventoryItemUnit
              ? inventoryUnitLabels[selectedInventoryItemUnit]
              : undefined
          }
          renderErrorMessage
          disabled={isLoading || !hasSelectedInventoryItem}
        />

        {isInventoryItemsEmpty ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: "4px", marginBottom: "20px" }}
          >
            Belum ada barang persediaan aktif. Tambahkan barang persediaan
            terlebih dahulu jika opsi ini perlu mengurangi stok.
          </Typography>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: "4px", marginBottom: "20px" }}
          >
            {hasSelectedInventoryItem
              ? "Jumlah ini dikurangi dari stok setiap satu opsi dipilih, sesuai satuan barang persediaan."
              : "Pilih “Tidak memakai persediaan” jika opsi ini tidak mengurangi stok."}
          </Typography>
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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          {props.option ? "Simpan Perubahan" : "Simpan Opsi"}
        </Button>
      </form>
    </FormDrawer>
  );
}
