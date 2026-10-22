import { z } from "zod";
import { CashTransactionFormValues } from "./CashTransactionForm.types";
import { editableCashTransactionType } from "@/constants/cashTransaction";

export const cashTransactionFormSchema = z.object({
  type: z.enum(
    [
      editableCashTransactionType.INVESTMENT,
      editableCashTransactionType.PROFIT_SHARING,
    ],
    {
      error: "Pilih jenis transaksi",
    },
  ),
  amount: z.number("Masukkan jumlah").positive("Jumlah harus lebih dari 0"),
  transactionAt: z.string().min(1, "Pilih tanggal transaksi"),
  description: z.string(),
});

export const emptyCashTransactionFormValues: CashTransactionFormValues = {
  type: undefined,
  amount: null,
  transactionAt: "",
  description: "",
};
