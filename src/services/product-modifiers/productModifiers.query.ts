import { useQuery } from "@tanstack/react-query";
import { fiveMinutes } from "@/constants/time";
import { PaginatedData } from "@/types/table";
import {
  ProductModifierGroupDetailResponse,
  ProductModifierGroupFilterPayload,
  ProductModifierGroupResponse,
  ProductModifierGroupsByProductResponse,
} from "@/types/productModifier";
import {
  fetchProductModifierGroupById,
  fetchProductModifierGroups,
  fetchProductModifierGroupsByProduct,
} from "./productModifiers.api";
import { productModifierKeys } from "./productModifiers.constants";

export function useProductModifierGroupsQuery(
  payload: ProductModifierGroupFilterPayload,
  enabled = true,
) {
  return useQuery<PaginatedData<ProductModifierGroupResponse>>({
    queryKey: productModifierKeys.list(payload),
    queryFn: () => fetchProductModifierGroups(payload),
    staleTime: fiveMinutes,
    retry: false,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useProductModifierGroupByIdQuery(
  id?: string,
  enabled = true,
) {
  return useQuery<ProductModifierGroupDetailResponse>({
    queryKey: productModifierKeys.detail(id),
    queryFn: () => {
      if (!id) {
        throw new Error("Modifier group id is required");
      }

      return fetchProductModifierGroupById(id);
    },
    enabled: Boolean(id) && enabled,
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useProductModifierGroupsByProductQuery(
  productId?: string,
  enabled = true,
  activeOnly = false,
) {
  return useQuery<ProductModifierGroupsByProductResponse>({
    queryKey: productModifierKeys.assignment(productId, activeOnly),
    queryFn: () => {
      if (!productId) {
        throw new Error("Product id is required");
      }

      return fetchProductModifierGroupsByProduct(productId, activeOnly);
    },
    enabled: Boolean(productId) && enabled,
    staleTime: fiveMinutes,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
