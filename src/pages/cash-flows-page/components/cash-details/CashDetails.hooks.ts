import { useCashTransactionBalanceQuery } from "@/services/cash-transactions/cashTransactions.query";
import useCashTransactionStore from "@/store/cash-transaction-store";
import { apiErrorHandler } from "@/utils/api";
import { useEffect } from "react";

export default function useCashDetails() {
  const { endDate, startDate } = useCashTransactionStore();

  useEffect(() => {
    console.log(">>> endDate : ", endDate);
    console.log(">>> startDate : ", startDate);
  }, [endDate, startDate]);

  const { data, isLoading, isError, error } = useCashTransactionBalanceQuery({
    endDate: endDate.length ? endDate : undefined,
    startDate: startDate.length ? startDate : undefined,
  });

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  return {
    data,
    isLoading,
  };
}
