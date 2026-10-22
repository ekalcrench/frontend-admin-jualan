import { CashTransactionType } from "@/types/cashTransaction";

export interface CreateCashTransaction {
  type: CashTransactionType;
  amount: number;
  transactionAt: string;
  description?: string;
}

export interface EditCashTransaction extends Partial<CreateCashTransaction> {
  id: string;
}
