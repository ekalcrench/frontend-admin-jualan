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

export interface CreateCashTransaction {
  type: CashTransactionType;
  amount: number;
  transactionAt: string;
  description?: string;
}

export interface EditCashTransaction extends Partial<CreateCashTransaction> {
  id: string;
}

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
  endDate?: string;
}

export interface CashTransactionBalanceResponse {
  balance: number;
}

export interface CashTransactionCashFlowFilter {
  startDate?: string;
  endDate?: string;
}

export interface CashTransactionCashFlowResponse {
  cashIn: number;
  cashOut: number;
  prevCashIn: number;
  prevCashOut: number;
}
