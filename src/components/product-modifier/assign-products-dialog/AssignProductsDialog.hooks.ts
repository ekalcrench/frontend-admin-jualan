import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useProductOptionsQuery } from "@/services/products/products.query";
import { useUpdateProductModifierGroupAssignmentsMutation } from "@/services/product-modifiers/productModifiers.mutation";
import type { ProductOptions } from "@/types/product";
import { apiErrorHandler } from "@/utils/api";
import type { AssignProductsDialogProps } from "./AssignProductsDialog.types";

export default function useAssignProductsDialog(
  props: AssignProductsDialogProps,
) {
  const {
    data: productOptions,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductOptionsQuery(props.open);
  const updateAssignments =
    useUpdateProductModifierGroupAssignmentsMutation();

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!props.open) return;

    setSearch("");
    setSelectedIds(props.assignedProducts.map((product) => product.id));
  }, [props.open]);

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  const assignedIds = useMemo(
    () => props.assignedProducts.map((product) => product.id),
    [props.assignedProducts],
  );

  const availableProducts = useMemo<ProductOptions[]>(() => {
    const products = productOptions ?? [];
    const productMap = new Map(products.map((product) => [product.id, product]));

    props.assignedProducts.forEach((product) => {
      if (!productMap.has(product.id)) {
        productMap.set(product.id, {
          id: product.id,
          name: product.name,
          sellingPrice: product.sellingPrice,
          isActive: false,
          stockManagement: "UNTRACKED",
          inventoryPolicy: "STRICT",
          stock: null,
        });
      }
    });

    return Array.from(productMap.values());
  }, [productOptions, props.assignedProducts]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const products = keyword
      ? availableProducts.filter((product) =>
          product.name.toLowerCase().includes(keyword),
        )
      : availableProducts;

    return [...products].sort((first, second) =>
      first.name.localeCompare(second.name, "id-ID"),
    );
  }, [availableProducts, search]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const assignedSet = useMemo(() => new Set(assignedIds), [assignedIds]);

  const addedProductIds = selectedIds.filter((id) => !assignedSet.has(id));
  const removedProductIds = assignedIds.filter((id) => !selectedSet.has(id));
  const hasChanges =
    addedProductIds.length > 0 || removedProductIds.length > 0;

  const handleToggleProduct = (productId: string) => {
    setSelectedIds((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId],
    );
  };

  const handleSubmit = async () => {
    if (!hasChanges) {
      toast.info("Tidak ada perubahan penugasan produk");
      return;
    }

    const toastId = toast.loading("Menyimpan penugasan produk...");
    try {
      await updateAssignments.mutateAsync({
        modifierGroupId: props.modifierGroupId,
        addProductIds: addedProductIds,
        removeProductIds: removedProductIds,
      });
      toast.success("Penugasan produk berhasil diperbarui");
      props.onClose();
    } catch (submitError) {
      apiErrorHandler(submitError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    addedProductIds,
    assignedSet,
    filteredProducts,
    hasChanges,
    isLoading,
    isError,
    isSaving: updateAssignments.isPending,
    refetch,
    search,
    selectedIds,
    selectedSet,
    setSearch,
    handleToggleProduct,
    handleSubmit,
  };
}
