import {
  CashTransactionBalanceFilter,
  CashTransactionFilterPayload,
} from "@/types/cashTransaction";

export const cashTransactionsKeys = {
  all: ["cash_transactions"] as const,

  lists: ["cash_transactions", "list"] as const,
  list: (params: CashTransactionFilterPayload) =>
    ["cash_transactions", "list", params] as const,

  details: ["cash_transactions", "detail"] as const,
  detail: (id?: string) => ["cash_transactions", "detail", id] as const,

  balances: ["cash_transactions", "balance"] as const,
  balance: (params: CashTransactionBalanceFilter) =>
    ["cash_transactions", "balance", params] as const,
};
