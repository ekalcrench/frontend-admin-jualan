import { apiClient } from "@/config/api";
import { api } from "@/constants/api";
import { PaginatedData } from "@/types/table";
import {
  ProductFilterPayload,
  ProductOptions,
  ProductResponse,
} from "@/types/product";
import { CreateProduct, EditProduct } from "./products.types";

export async function fetchProducts(
  payload: ProductFilterPayload,
): Promise<PaginatedData<ProductResponse>> {
  const response = await apiClient.get<PaginatedData<ProductResponse>>(
    api.products.base,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function fetchProductOptions(): Promise<ProductOptions[]> {
  const response = await apiClient.get<ProductOptions[]>(api.products.options);
  return response.data;
}

export async function fetchProductById(id: string): Promise<ProductResponse> {
  const response = await apiClient.get<ProductResponse>(api.products.byId(id));
  return response.data;
}

export async function createProduct(
  data: CreateProduct,
): Promise<ProductResponse> {
  const response = await apiClient.post<ProductResponse>(
    api.products.base,
    data,
  );
  return response.data;
}

export async function editProduct(data: EditProduct): Promise<ProductResponse> {
  const { id, ...remainingData } = data;
  const response = await apiClient.patch<ProductResponse>(
    api.products.byId(data.id),
    remainingData,
  );
  return response.data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(api.products.byId(id));
  return response.data;
}
