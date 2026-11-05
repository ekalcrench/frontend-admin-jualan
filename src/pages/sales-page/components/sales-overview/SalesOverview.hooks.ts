import { apiErrorHandler } from "@/utils/api";
import { useEffect } from "react";
import { SalesOverviewProps } from "./SalesOverview.types";
import {
  useOrderOverviewItemsQuery,
  useOrderOverviewQuery,
} from "@/services/orders/orders.query";

export default function useSalesOverview({
  endDate,
  startDate,
}: SalesOverviewProps) {
  const { data, isLoading, isError, error } = useOrderOverviewQuery({
    endDate: endDate?.length ? endDate : undefined,
    startDate: startDate?.length ? startDate : undefined,
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
    endDate: endDate?.length ? endDate : undefined,
    startDate: startDate?.length ? startDate : undefined,
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
