import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CustomDateTimePicker from "@/components/custom-date-time-picker";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import useCashTransactionForm from "./CashTransactionForm.hooks";
import { CashTransactionFormProps } from "./CashTransactionForm.types";
import CustomAutocomplete from "@/components/custom-autocomplete";
import {
  cashTransactionOptions,
  cashTransactionTypeLabels,
} from "@/constants/cashTransaction";
import { CashTransactionType } from "@/types/cashTransaction";

export default function CashTransactionForm(props: CashTransactionFormProps) {
  const { canEditTransaction, control, isLoading, handleSubmit, onSubmit } =
    useCashTransactionForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableCloseOnOutsideInteraction
      title={props.id ? "Edit Arus Kas" : "Tambah Arus Kas"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomAutocomplete
          control={control}
          name="type"
          label="Jenis Transaksi"
          placeholder="Pilih jenis transaksi"
          renderErrorMessage
          disabled={isLoading || !canEditTransaction}
          autocompleteProps={{
            options: cashTransactionOptions,
            getOptionLabel: (unit) =>
              cashTransactionTypeLabels[unit as CashTransactionType],
          }}
        />

        <CustomInputNumber
          name="amount"
          control={control}
          label="Jumlah"
          placeholder="100.000"
          startAdornment="Rp."
          renderErrorMessage
          disabled={isLoading || !canEditTransaction}
        />

        <CustomDateTimePicker
          control={control}
          name="transactionAt"
          label="Tanggal Transaksi"
          renderErrorMessage
          disabled={isLoading || !canEditTransaction}
        />

        <CustomInput
          name="description"
          control={control}
          label="Deskripsi"
          placeholder="Keterangan transaksi (optional)"
          renderErrorMessage
          disabled={isLoading || !canEditTransaction}
        />

        <Button
          sx={{ mt: "32px" }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
          disabled={!canEditTransaction}
        >
          Simpan Arus Kas
        </Button>
      </form>
    </FormDrawer>
  );
}
