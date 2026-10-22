import {
  CashTransactionType,
  EditableCashTransactionType,
} from "@/types/cashTransaction";
import { LabelValue } from "@/types/generalTypes";
import { ChipProps } from "@mui/material";

export const cashTransactionType: Record<
  CashTransactionType,
  CashTransactionType
> = {
  INVESTMENT: "INVESTMENT",
  PROFIT_SHARING: "PROFIT_SHARING",
  PURCHASE: "PURCHASE",
  SALE: "SALE",
};

export const editableCashTransactionType: Record<
  EditableCashTransactionType,
  EditableCashTransactionType
> = {
  INVESTMENT: "INVESTMENT",
  PROFIT_SHARING: "PROFIT_SHARING",
};

export const cashTransactionTypeLabels: Record<CashTransactionType, string> = {
  PURCHASE: "Pembelian",
  SALE: "Penjualan",
  INVESTMENT: "Investasi",
  PROFIT_SHARING: "Bagi Hasil",
};

export const cashTransactionTypeColorMapping: Record<
  CashTransactionType,
  ChipProps["color"]
> = {
  PURCHASE: "error",
  SALE: "primary",
  INVESTMENT: "success",
  PROFIT_SHARING: "warning",
};

export const cashTransactionOptions: EditableCashTransactionType[] = [
  editableCashTransactionType.INVESTMENT,
  editableCashTransactionType.PROFIT_SHARING,
];

export function isEditableCashTransactionType(
  type: CashTransactionType | undefined,
): type is EditableCashTransactionType {
  return type === "INVESTMENT" || type === "PROFIT_SHARING";
}
