import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import { productsKeys } from "./products.constants";
import {
  fetchProductById,
  fetchProductLowestStocks,
  fetchProductOptions,
  fetchProducts,
} from "./products.api";
import {
  ProductFilterPayload,
  ProductLowestStock,
  ProductOptions,
  ProductResponse,
} from "@/types/product";

export function useProductQuery(payload: ProductFilterPayload) {
  return useQuery<PaginatedData<ProductResponse>>({
    queryKey: productsKeys.list(payload),
    queryFn: () => fetchProducts(payload),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useProductOptionsQuery(enabled: boolean) {
  return useQuery<ProductOptions[]>({
    queryKey: productsKeys.options,
    queryFn: () => fetchProductOptions(),
    staleTime: fiveMinutes,
    enabled,
  });
}

export function useProductByIdQuery(id?: string) {
  return useQuery<ProductResponse>({
    queryKey: productsKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("Product id is required");
      }

      return fetchProductById(id);
    },
    enabled: Boolean(id),
    staleTime: fiveMinutes,
  });
}

export function useProductLowestStocksQuery() {
  return useQuery<ProductLowestStock[]>({
    queryKey: productsKeys.lowestStocks,
    queryFn: () => fetchProductLowestStocks(),
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
