import { useProductLowestStocksQuery } from "@/services/products/products.query";
import { apiErrorHandler } from "@/utils/api";
import { useEffect } from "react";

export default function useProductOverview() {
  const { data, isLoading, isError, error } = useProductLowestStocksQuery();

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  return {
    data,
    isLoading,
  };
}
