import { useInventoryItemAssetsQuery } from "@/services/inventory-items/inventoryItems.query";
import { apiErrorHandler } from "@/utils/api";
import { useEffect } from "react";

export default function useInventoryItemOverview() {
  const { data, isLoading, isError, error } = useInventoryItemAssetsQuery();

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  return {
    data,
    isLoading,
  };
}
