import { useMutation } from "@tanstack/react-query";
import { ProductResponse } from "@/types/product";
import { CreateProduct, EditProduct } from "./products.types";
import { createProduct, deleteProduct, editProduct } from "./products.api";
import { productsKeys } from "./products.constants";

export function useCreateProductMutation() {
  return useMutation<ProductResponse, Error, CreateProduct>({
    mutationFn: createProduct,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: productsKeys.lists() });
      context.client.setQueryData(productsKeys.detail(result.id), result);
    },
  });
}

export function useEditProductMutation() {
  return useMutation<ProductResponse, Error, EditProduct>({
    mutationFn: editProduct,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: productsKeys.lists() });
      context.client.setQueryData(productsKeys.detail(result.id), result);
    },
  });
}

export function useDeleteProductMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: productsKeys.all });
    },
  });
}
