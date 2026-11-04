import { apiErrorHandler } from "@/utils/api";
import { useEffect } from "react";
import { SalesDetailsProps } from "./SalesDetails.types";
import {
  useOrderOverviewItemsQuery,
  useOrderOverviewQuery,
} from "@/services/orders/orders.query";

export default function useSalesDetails({
  endDate,
  startDate,
}: SalesDetailsProps) {
  const { data, isLoading, isError, error } = useOrderOverviewQuery({
    endDate: endDate.length ? endDate : undefined,
    startDate: startDate.length ? startDate : undefined,
  });

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  const {
    data: dataOverviewItems,
    isLoading: isLoadingOverviewItems,
    isError: isErrorOverviewItems,
    error: errorOverviewItems,
  } = useOrderOverviewItemsQuery({
    endDate: endDate.length ? endDate : undefined,
    startDate: startDate.length ? startDate : undefined,
  });

  useEffect(() => {
    if (isErrorOverviewItems && errorOverviewItems)
      apiErrorHandler(errorOverviewItems);
  }, [isErrorOverviewItems, errorOverviewItems]);

  return {
    data,
    dataOverviewItems,
    isLoading,
    isLoadingOverviewItems,
  };
}
