import { Button } from "@mui/material";
import CustomAutocomplete from "@/components/custom-autocomplete";
import CustomInput from "@/components/custom-input";
import FormDrawer from "@/components/form-drawer";
import { inventoryUnits } from "./InventoryItemForm.constants";
import useInventoryItemForm from "./InventoryItemForm.hooks";
import { InventoryItemFormProps } from "./InventoryItemForm.types";

const unitLabels: Record<(typeof inventoryUnits)[number], string> = {
  GRAM: "Gram (g)",
  ML: "Mililiter (ml)",
  PCS: "Pcs",
};

export default function InventoryItemForm(props: InventoryItemFormProps) {
  const { control, errors, isLoading, handleSubmit, onSubmit } =
    useInventoryItemForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      title={props.item ? "Edit Barang Persediaan" : "Tambah Barang Persediaan"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          name="name"
          control={control}
          errors={errors}
          label="Nama Barang"
          placeholder="Contoh: Tepung terigu"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomAutocomplete
          name="unit"
          control={control}
          errors={errors}
          label="Satuan"
          placeholder="Pilih satuan"
          renderErrorMessage
          disabled={isLoading}
          autocompleteProps={{
            options: inventoryUnits,
            disableClearable: true,
            getOptionLabel: (unit) => unitLabels[unit],
          }}
        />

        <Button
          sx={{ marginTop: "20px" }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          Simpan
        </Button>
      </form>
    </FormDrawer>
  );
}
