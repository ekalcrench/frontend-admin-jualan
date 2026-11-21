import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import {
  ProductModifierGroupDetailResponse,
  ProductModifierGroupFilterPayload,
  ProductModifierGroupResponse,
  ProductModifierGroupsByProductResponse,
  ProductModifierOptionResponse,
} from "@/types/productModifier";
import {
  CreateProductModifierGroup,
  CreateProductModifierOptionPayload,
  RemoveProductModifierGroup,
  ReorderProductModifierOptions,
  ReplaceProductModifierGroups,
  UpdateProductModifierGroup,
  UpdateProductModifierGroupStatus,
  UpdateProductModifierOption,
  UpdateProductModifierOptionStatus,
} from "./productModifiers.types";

export async function fetchProductModifierGroups(
  payload: ProductModifierGroupFilterPayload,
): Promise<PaginatedData<ProductModifierGroupResponse>> {
  const response = await apiClient.get<
    PaginatedData<ProductModifierGroupResponse>
  >(api.productModifierGroups.base, { params: payload });

  return response.data;
}

export async function fetchProductModifierGroupById(
  id: string,
): Promise<ProductModifierGroupDetailResponse> {
  const response = await apiClient.get<ProductModifierGroupDetailResponse>(
    api.productModifierGroups.byId(id),
  );

  return response.data;
}

export async function createProductModifierGroup(
  data: CreateProductModifierGroup,
): Promise<ProductModifierGroupDetailResponse> {
  const response = await apiClient.post<ProductModifierGroupDetailResponse>(
    api.productModifierGroups.base,
    data,
  );

  return response.data;
}

export async function editProductModifierGroup(
  data: UpdateProductModifierGroup,
): Promise<ProductModifierGroupDetailResponse> {
  const { id, ...payload } = data;
  const response = await apiClient.patch<ProductModifierGroupDetailResponse>(
    api.productModifierGroups.byId(id),
    payload,
  );

  return response.data;
}

export async function setProductModifierGroupActive({
  id,
  isActive,
}: UpdateProductModifierGroupStatus): Promise<ProductModifierGroupDetailResponse> {
  const response = await apiClient.patch<ProductModifierGroupDetailResponse>(
    api.productModifierGroups.status(id),
    { isActive },
  );

  return response.data;
}

export async function deleteProductModifierGroup(
  id: string,
): Promise<boolean> {
  const response = await apiClient.delete<boolean>(
    api.productModifierGroups.byId(id),
  );

  return response.data;
}

export async function createProductModifierOption(
  data: CreateProductModifierOptionPayload,
): Promise<ProductModifierOptionResponse> {
  const { modifierGroupId, ...payload } = data;
  const response = await apiClient.post<ProductModifierOptionResponse>(
    api.productModifierGroups.options(modifierGroupId),
    payload,
  );

  return response.data;
}

export async function editProductModifierOption(
  data: UpdateProductModifierOption,
): Promise<ProductModifierOptionResponse> {
  const { id, ...payload } = data;
  const response = await apiClient.patch<ProductModifierOptionResponse>(
    api.productModifierOptions.byId(id),
    payload,
  );

  return response.data;
}

export async function setProductModifierOptionActive({
  id,
  isActive,
}: UpdateProductModifierOptionStatus): Promise<ProductModifierOptionResponse> {
  const response = await apiClient.patch<ProductModifierOptionResponse>(
    api.productModifierOptions.status(id),
    { isActive },
  );

  return response.data;
}

export async function deleteProductModifierOption(
  id: string,
): Promise<boolean> {
  const response = await apiClient.delete<boolean>(
    api.productModifierOptions.byId(id),
  );

  return response.data;
}

export async function reorderProductModifierOptions(
  data: ReorderProductModifierOptions,
): Promise<ProductModifierOptionResponse[]> {
  const { modifierGroupId, optionIds } = data;
  const response = await apiClient.patch<ProductModifierOptionResponse[]>(
    api.productModifierGroups.reorderOptions(modifierGroupId),
    { optionIds },
  );

  return response.data;
}

export async function fetchProductModifierGroupsByProduct(
  productId: string,
  activeOnly = false,
): Promise<ProductModifierGroupsByProductResponse> {
  const response = await apiClient.get<ProductModifierGroupsByProductResponse>(
    api.productModifierAssignments.base(productId),
    { params: { activeOnly } },
  );

  return response.data;
}

export async function replaceProductModifierGroups(
  data: ReplaceProductModifierGroups,
): Promise<ProductModifierGroupsByProductResponse> {
  const { productId, modifierGroupIds } = data;
  const response = await apiClient.put<ProductModifierGroupsByProductResponse>(
    api.productModifierAssignments.base(productId),
    { modifierGroupIds },
  );

  return response.data;
}

export async function removeProductModifierGroup(
  data: RemoveProductModifierGroup,
): Promise<boolean> {
  const { productId, modifierGroupId } = data;
  const response = await apiClient.delete<boolean>(
    api.productModifierAssignments.byId(productId, modifierGroupId),
  );

  return response.data;
}
