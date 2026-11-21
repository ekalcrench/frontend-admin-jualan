import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useDeleteProductModifierOptionMutation,
  useRemoveProductModifierGroupMutation,
  useReorderProductModifierOptionsMutation,
  useSetProductModifierOptionActiveMutation,
} from "@/services/product-modifiers/productModifiers.mutation";
import { useProductModifierGroupByIdQuery } from "@/services/product-modifiers/productModifiers.query";
import { productModifierKeys } from "@/services/product-modifiers/productModifiers.constants";
import useConfirmationStore from "@/store/confirmation-store";
import type {
  ProductModifierGroupAssignedProduct,
  ProductModifierGroupDetailResponse,
  ProductModifierOptionResponse,
} from "@/types/productModifier";
import { apiErrorHandler } from "@/utils/api";

export default function useProductModifierDetailPage(modifierGroupId: string) {
  const groupQuery = useProductModifierGroupByIdQuery(modifierGroupId);
  const setOptionActive = useSetProductModifierOptionActiveMutation();
  const deleteOption = useDeleteProductModifierOptionMutation();
  const reorderOptions = useReorderProductModifierOptionsMutation();
  const removeAssignment = useRemoveProductModifierGroupMutation();
  const confirm = useConfirmationStore((state) => state.confirm);
  const queryClient = useQueryClient();

  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [isOptionFormOpen, setIsOptionFormOpen] = useState(false);
  const [editingOption, setEditingOption] =
    useState<ProductModifierOptionResponse>();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    if (groupQuery.isError && groupQuery.error) {
      apiErrorHandler(groupQuery.error);
    }
  }, [groupQuery.isError, groupQuery.error]);

  const handleClickAddOption = () => {
    setEditingOption(undefined);
    setIsOptionFormOpen(true);
  };

  const handleClickEditOption = (option: ProductModifierOptionResponse) => {
    setEditingOption(option);
    setIsOptionFormOpen(true);
  };

  const handleClickDeleteOption = async (
    option: ProductModifierOptionResponse,
  ) => {
    const confirmed = await confirm({
      title: "Hapus Opsi Variasi",
      message: `Apakah Anda yakin ingin menghapus opsi "${option.name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal",
    });

    if (!confirmed) return;

    const toastId = toast.loading("Menghapus opsi variasi...");
    try {
      await deleteOption.mutateAsync(option.id);
      toast.success("Opsi variasi berhasil dihapus");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleClickToggleOptionActive = async (
    option: ProductModifierOptionResponse,
  ) => {
    try {
      await setOptionActive.mutateAsync({
        id: option.id,
        isActive: !option.isActive,
      });
      toast.success(
        option.isActive
          ? "Opsi variasi berhasil dinonaktifkan"
          : "Opsi variasi berhasil diaktifkan",
      );
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  const handleMoveOption = async (index: number, direction: -1 | 1) => {
    const currentOptions = groupQuery.data?.options;
    if (!currentOptions) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentOptions.length) return;

    const reorderedOptions = [...currentOptions];
    [reorderedOptions[index], reorderedOptions[targetIndex]] = [
      reorderedOptions[targetIndex],
      reorderedOptions[index],
    ];

    queryClient.setQueryData<ProductModifierGroupDetailResponse>(
      productModifierKeys.detail(modifierGroupId),
      (current) =>
        current
          ? {
              ...current,
              options: reorderedOptions,
            }
          : current,
    );

    const toastId = toast.loading("Menyimpan urutan opsi...");
    try {
      await reorderOptions.mutateAsync({
        modifierGroupId,
        optionIds: reorderedOptions.map((option) => option.id),
      });
      toast.success("Urutan opsi berhasil diperbarui");
    } catch (error) {
      await queryClient.invalidateQueries({
        queryKey: productModifierKeys.detail(modifierGroupId),
      });
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleClickRemoveProduct = async (
    product: ProductModifierGroupAssignedProduct,
  ) => {
    const confirmed = await confirm({
      title: "Hapus Penugasan Produk",
      message: `Produk "${product.name}" tidak akan lagi menggunakan grup variasi ini. Lanjutkan?`,
      confirmText: "Hapus Penugasan",
      cancelText: "Batal",
    });

    if (!confirmed) return;

    const toastId = toast.loading("Menghapus penugasan produk...");
    try {
      await removeAssignment.mutateAsync({
        productId: product.id,
        modifierGroupId,
      });
      toast.success("Penugasan produk berhasil dihapus");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const options = groupQuery.data?.options ?? [];
  const nextSortOrder = options.length
    ? Math.max(...options.map((option) => option.sortOrder)) + 1
    : 0;

  return {
    groupQuery,
    group: groupQuery.data,
    options,
    nextSortOrder,
    isGroupFormOpen,
    isOptionFormOpen,
    editingOption,
    isAssignDialogOpen,
    deleteOption,
    reorderOptions,
    setOptionActive,
    removeAssignment,
    handleClickAddOption,
    handleClickDeleteOption,
    handleClickEditOption,
    handleClickToggleOptionActive,
    handleClickRemoveProduct,
    handleMoveOption,
    setIsGroupFormOpen,
    setIsOptionFormOpen,
    setIsAssignDialogOpen,
  };
}
