import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CashTransactionState } from "./cashTransactionStore.types";

const useCashTransactionStore = create<CashTransactionState>()((set) => ({
  startDate: "",
  endDate: "",

  setStartDate: (startDate: string) => {
    set({ startDate });
  },
  setEndDate: (endDate: string) => {
    set({ endDate });
  },
}));

export default useCashTransactionStore;
