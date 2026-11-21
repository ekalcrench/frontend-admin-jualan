import { useMutation } from "@tanstack/react-query";
import {
  ProductModifierGroupDetailResponse,
  ProductModifierGroupsByProductResponse,
  ProductModifierOptionResponse,
} from "@/types/productModifier";
import {
  createProductModifierGroup,
  createProductModifierOption,
  deleteProductModifierGroup,
  deleteProductModifierOption,
  editProductModifierGroup,
  editProductModifierOption,
  fetchProductModifierGroupsByProduct,
  removeProductModifierGroup,
  reorderProductModifierOptions,
  replaceProductModifierGroups,
  setProductModifierGroupActive,
  setProductModifierOptionActive,
} from "./productModifiers.api";
import { productModifierKeys } from "./productModifiers.constants";
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
  UpdateProductModifierGroupAssignments,
} from "./productModifiers.types";

export function useCreateProductModifierGroupMutation() {
  return useMutation<
    ProductModifierGroupDetailResponse,
    Error,
    CreateProductModifierGroup
  >({
    mutationFn: createProductModifierGroup,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.lists,
      });
      context.client.invalidateQueries({
        queryKey: productModifierKeys.assignments,
      });
      context.client.setQueryData(
        productModifierKeys.detail(result.id),
        result,
      );
    },
  });
}

export function useEditProductModifierGroupMutation() {
  return useMutation<
    ProductModifierGroupDetailResponse,
    Error,
    UpdateProductModifierGroup
  >({
    mutationFn: editProductModifierGroup,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.lists,
      });
      context.client.invalidateQueries({
        queryKey: productModifierKeys.assignments,
      });
      context.client.setQueryData(
        productModifierKeys.detail(result.id),
        result,
      );
    },
  });
}

export function useSetProductModifierGroupActiveMutation() {
  return useMutation<
    ProductModifierGroupDetailResponse,
    Error,
    UpdateProductModifierGroupStatus
  >({
    mutationFn: setProductModifierGroupActive,
    onSuccess: (result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.lists,
      });
      context.client.invalidateQueries({
        queryKey: productModifierKeys.assignments,
      });
      context.client.setQueryData(
        productModifierKeys.detail(result.id),
        result,
      );
    },
  });
}

export function useDeleteProductModifierGroupMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteProductModifierGroup,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.all,
      });
    },
  });
}

export function useCreateProductModifierOptionMutation() {
  return useMutation<
    ProductModifierOptionResponse,
    Error,
    CreateProductModifierOptionPayload
  >({
    mutationFn: createProductModifierOption,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.all,
      });
    },
  });
}

export function useEditProductModifierOptionMutation() {
  return useMutation<
    ProductModifierOptionResponse,
    Error,
    UpdateProductModifierOption
  >({
    mutationFn: editProductModifierOption,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.all,
      });
    },
  });
}

export function useSetProductModifierOptionActiveMutation() {
  return useMutation<
    ProductModifierOptionResponse,
    Error,
    UpdateProductModifierOptionStatus
  >({
    mutationFn: setProductModifierOptionActive,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.all,
      });
    },
  });
}

export function useDeleteProductModifierOptionMutation() {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteProductModifierOption,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.all,
      });
    },
  });
}

export function useReorderProductModifierOptionsMutation() {
  return useMutation<
    ProductModifierOptionResponse[],
    Error,
    ReorderProductModifierOptions
  >({
    mutationFn: reorderProductModifierOptions,
    onSuccess: (result, payload, _onMutateResult, context) => {
      context.client.setQueryData<ProductModifierGroupDetailResponse>(
        productModifierKeys.detail(payload.modifierGroupId),
        (current) =>
          current
            ? {
                ...current,
                options: result,
              }
            : current,
      );
      context.client.invalidateQueries({
        queryKey: productModifierKeys.assignments,
      });
    },
  });
}

export function useReplaceProductModifierGroupsMutation() {
  return useMutation<
    ProductModifierGroupsByProductResponse,
    Error,
    ReplaceProductModifierGroups
  >({
    mutationFn: replaceProductModifierGroups,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.assignments,
      });
      context.client.invalidateQueries({
        queryKey: productModifierKeys.details,
      });
      context.client.invalidateQueries({
        queryKey: productModifierKeys.lists,
      });
    },
  });
}

export function useRemoveProductModifierGroupMutation() {
  return useMutation<boolean, Error, RemoveProductModifierGroup>({
    mutationFn: removeProductModifierGroup,
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.assignments,
      });
      context.client.invalidateQueries({
        queryKey: productModifierKeys.details,
      });
      context.client.invalidateQueries({
        queryKey: productModifierKeys.lists,
      });
    },
  });
}

export function useUpdateProductModifierGroupAssignmentsMutation() {
  return useMutation<void, Error, UpdateProductModifierGroupAssignments>({
    mutationFn: async ({
      modifierGroupId,
      addProductIds,
      removeProductIds,
    }) => {
      await Promise.all(
        addProductIds.map(async (productId) => {
          const assignment =
            await fetchProductModifierGroupsByProduct(productId);
          const currentIds = assignment.modifierGroups.map(
            (group) => group.id,
          );

          if (currentIds.includes(modifierGroupId)) return;

          await replaceProductModifierGroups({
            productId,
            modifierGroupIds: [...currentIds, modifierGroupId],
          });
        }),
      );

      await Promise.all(
        removeProductIds.map((productId) =>
          removeProductModifierGroup({ productId, modifierGroupId }),
        ),
      );
    },
    onSuccess: (_result, _payload, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: productModifierKeys.all,
      });
    },
  });
}
