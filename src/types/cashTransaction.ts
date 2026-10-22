import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface CashTransactionFilterPayload extends DefaultFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
}

export type CashTransactionType =
  | "PURCHASE"
  | "SALE"
  | "INVESTMENT"
  | "PROFIT_SHARING";

export type EditableCashTransactionType = "INVESTMENT" | "PROFIT_SHARING";

export interface CashTransactionResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  type: CashTransactionType;
  amount: number;
  transactionAt: string;
  description: string | null;
  referenceId: string | null;
}

export interface CashTransactionBalanceFilter {
  startDate?: string;
  endDate?: string;
}

export interface CashTransactionBalanceResponse {
  remainingCash: number;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
}
