import {
  useCashTransactionBalanceQuery,
  useCashTransactionCashFlowQuery,
} from "@/services/cash-transactions/cashTransactions.query";
import { apiErrorHandler } from "@/utils/api";
import { useEffect } from "react";
import { CashOverviewProps } from "./CashOverview.types";

export default function useCashOverview({
  endDate,
  startDate,
}: CashOverviewProps) {
  const { data, isLoading, isError, error } = useCashTransactionBalanceQuery({
    endDate: endDate?.length ? endDate : undefined,
  });

  const {
    data: dataCashFlow,
    isLoading: isLoadingCashFlow,
    isError: isErrorCashFlow,
    error: errorCashFlow,
  } = useCashTransactionCashFlowQuery({
    endDate: endDate?.length ? endDate : undefined,
    startDate: startDate?.length ? startDate : undefined,
  });

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  useEffect(() => {
    if (isErrorCashFlow && errorCashFlow) apiErrorHandler(errorCashFlow);
  }, [isErrorCashFlow, errorCashFlow]);

  return {
    data,
    dataCashFlow,
    isLoading,
    isLoadingCashFlow,
  };
}
