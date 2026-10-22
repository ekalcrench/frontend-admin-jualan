import { EditableCashTransactionType } from "@/types/cashTransaction";

export interface CashTransactionFormProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  setIsFormOpen: (open: boolean) => void;
  id?: string;
}

export interface CashTransactionFormValues {
  type: EditableCashTransactionType | undefined;
  amount: number | null;
  transactionAt: string;
  description: string;
}
