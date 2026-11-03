import { useCashTransactionBalanceQuery } from "@/services/cash-transactions/cashTransactions.query";
import { apiErrorHandler } from "@/utils/api";
import { useEffect } from "react";
import { CashDetailsProps } from "./CashDetails.types";

export default function useCashDetails({
  endDate,
  startDate,
}: CashDetailsProps) {
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
