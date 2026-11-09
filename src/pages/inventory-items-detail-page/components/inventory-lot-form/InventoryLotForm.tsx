import { Button } from "@mui/material";
import CustomDateTimePicker from "@/components/custom-date-time-picker";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import useInventoryLotForm from "./InventoryLotForm.hooks";
import type { InventoryLotFormProps } from "./InventoryLotForm.types";

export default function InventoryLotForm(props: InventoryLotFormProps) {
  const { control, isLoading, handleSubmit, onSubmit } =
    useInventoryLotForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableCloseOnOutsideInteraction
      title="Edit Lot Stok"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInputNumber
          name="remainingQuantity"
          control={control}
          label="Sisa Stok"
          placeholder="Masukkan sisa stok"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomDateTimePicker
          control={control}
          name="receivedAt"
          label="Tanggal Diterima"
          renderErrorMessage
          disabled={isLoading}
        />

        <CustomDateTimePicker
          control={control}
          name="expiredAt"
          label="Tanggal Kedaluwarsa"
          renderErrorMessage
          disabled={isLoading}
          dateTimePickerProps={{ slotProps: { field: { clearable: true } } }}
        />

        <Button
          sx={{ mt: "32px" }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          Simpan Perubahan
        </Button>
      </form>
    </FormDrawer>
  );
}
