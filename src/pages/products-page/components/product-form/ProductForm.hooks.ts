import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FieldNamesMarkedBoolean,
  Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import useProductModifierAccess from "@/hooks/useProductModifierAccess";
import { useInventoryItemOptionsQuery } from "@/services/inventory-items/inventoryItems.query";
import {
  useCreateProductMutation,
  useEditProductMutation,
} from "@/services/products/products.mutation";
import { useProductByIdQuery } from "@/services/products/products.query";
import {
  useProductModifierGroupsByProductQuery,
  useProductModifierGroupsQuery,
} from "@/services/product-modifiers/productModifiers.query";
import { useReplaceProductModifierGroupsMutation } from "@/services/product-modifiers/productModifiers.mutation";
import type {
  CreateProduct,
  CreateProductIngredients,
  EditProduct,
  EditProductIngredients,
} from "@/services/products/products.types";
import { apiErrorHandler } from "@/utils/api";
import { areSameIds } from "@/utils/productModifier";
import {
  emptyProductFormValues,
  productFormSchema,
} from "./ProductForm.constants";
import type {
  ProductFormProps,
  ProductFormValues,
  ProductIngredientFormValues,
} from "./ProductForm.types";
import type { ProductModifierGroupOption } from "./components/product-modifier-section/ProductModifierSection.types";

function toCreateProduct(values: ProductFormValues): CreateProduct {
  return {
    name: values.name,
    sellingPrice: values.sellingPrice ?? 0,
    isActive: values.isActive,
    stockManagement: values.stockManagement,
    inventoryPolicy: values.inventoryPolicy,
    ...(values.stockManagement === "MANUAL" && {
      stock: values.stock ?? 0,
    }),
    productIngredients: values.productIngredients.map((ingredient) => ({
      inventoryItemId: ingredient.inventoryItemId?.value ?? "",
      quantity: ingredient.quantity ?? 0,
    })),
  };
}

function toCreateProductIngredients(
  values: ProductIngredientFormValues,
): CreateProductIngredients {
  return {
    quantity: values.quantity ?? 0,
    inventoryItemId: values.inventoryItemId?.value ?? "",
  };
}

function toEditProductIngredients(
  items: ProductIngredientFormValues[],
  dirtyItems: FieldNamesMarkedBoolean<ProductFormValues>["productIngredients"],
): EditProductIngredients[] {
  return items.flatMap<EditProductIngredients>(
    (item, index): EditProductIngredients[] => {
      const dirtyItem = dirtyItems?.[index];
      if (!dirtyItem) return [];

      if (!item.id) return [toCreateProductIngredients(item)];

      return [
        {
          id: item.id,
          ...(dirtyItem.inventoryItemId && {
            inventoryItemId: item.inventoryItemId?.value ?? "",
          }),
          ...(dirtyItem.quantity && {
            quantity: item.quantity ?? 0,
          }),
        },
      ];
    },
  );
}

export default function useProductForm(props: ProductFormProps) {
  const createProduct = useCreateProductMutation();
  const editProduct = useEditProductMutation();
  const replaceModifierGroups = useReplaceProductModifierGroupsMutation();
  const productQuery = useProductByIdQuery(props.id);
  const { canManage } = useProductModifierAccess();

  const modifierGroupsQuery = useProductModifierGroupsQuery(
    {
      page: 1,
      size: 1000,
      sortBy: "sortOrder",
      isActive: true,
    },
    Boolean(props.open),
  );
  const productModifierGroupsQuery = useProductModifierGroupsByProductQuery(
    props.id,
    Boolean(props.open && props.id),
  );

  const [selectedModifierGroupIds, setSelectedModifierGroupIds] = useState<
    string[]
  >([]);
  const [initialModifierGroupIds, setInitialModifierGroupIds] = useState<
    string[]
  >([]);
  const modifierAssignmentLoadedRef = useRef<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, dirtyFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
    mode: "onBlur",
    defaultValues: emptyProductFormValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productIngredients",
  });
  const productIngredientsValues = useWatch({
    control,
    name: "productIngredients",
  });
  const stockManagement = useWatch({
    control,
    name: "stockManagement",
  });

  const [deletedProductIngredientIds, setDeletedProductIngredientIds] =
    useState<string[]>([]);

  useEffect(() => {
    if (!props.open) {
      setDeletedProductIngredientIds([]);
      return;
    }
    if (!props.id) {
      reset(emptyProductFormValues);
      return;
    }
    if (!productQuery.data) return;

    const product = productQuery.data;
    reset({
      name: product.name,
      sellingPrice: product.sellingPrice,
      isActive: product.isActive,
      stockManagement: product.stockManagement,
      inventoryPolicy: product.inventoryPolicy,
      stock:
        product.stockManagement === "MANUAL" ? product.stock : null,
      productIngredients: product.productIngredients.map((ingredient) => ({
        id: ingredient.id,
        inventoryItemId: {
          value: ingredient.inventoryItem.id,
          label: `${ingredient.inventoryItem.name} (${inventoryUnitLabels[ingredient.inventoryItem.unit]})`,
        },
        quantity: ingredient.quantity,
      })),
    });
  }, [props.id, props.open, productQuery.data, reset]);

  useEffect(() => {
    if (!props.open || !props.id) {
      modifierAssignmentLoadedRef.current = null;
      setSelectedModifierGroupIds([]);
      setInitialModifierGroupIds([]);
      return;
    }
    if (
      !productModifierGroupsQuery.isSuccess ||
      productModifierGroupsQuery.isFetching ||
      productModifierGroupsQuery.isStale
    ) {
      return;
    }
    if (!productModifierGroupsQuery.data) return;
    if (modifierAssignmentLoadedRef.current === props.id) return;

    const assignedIds =
      productModifierGroupsQuery.data.modifierGroups.map(
        (group) => group.id,
      );

    setSelectedModifierGroupIds(assignedIds);
    setInitialModifierGroupIds(assignedIds);
    modifierAssignmentLoadedRef.current = props.id;
  }, [props.id, props.open, productModifierGroupsQuery.data]);

  const modifierGroupOptions = useMemo<ProductModifierGroupOption[]>(() => {
    const options = new Map<string, ProductModifierGroupOption>();

    (modifierGroupsQuery.data?.items ?? []).forEach((group) => {
      options.set(group.id, {
        id: group.id,
        name: group.name,
        isRequired: group.isRequired,
        isMultiple: group.isMultiple,
        minSelection: group.minSelection,
        maxSelection: group.maxSelection,
        isActive: group.isActive,
        optionsCount: group.optionsCount,
      });
    });

    (productModifierGroupsQuery.data?.modifierGroups ?? []).forEach(
      (group) => {
        options.set(group.id, {
          id: group.id,
          name: group.name,
          isRequired: group.isRequired,
          isMultiple: group.isMultiple,
          minSelection: group.minSelection,
          maxSelection: group.maxSelection,
          isActive: group.isActive,
          optionsCount: group.options.length,
        });
      },
    );

    return Array.from(options.values());
  }, [modifierGroupsQuery.data, productModifierGroupsQuery.data]);

  const isLoadingGetData = Boolean(
    props.id &&
    (!productQuery.data || productQuery.isPending || productQuery.isFetching),
  );
  const isLoadingModifierAssignment = Boolean(
    props.id &&
    props.open &&
    (productModifierGroupsQuery.isPending ||
      productModifierGroupsQuery.isFetching),
  );
  const isLoading =
    isSubmitting ||
    createProduct.isPending ||
    editProduct.isPending ||
    replaceModifierGroups.isPending ||
    isLoadingGetData ||
    isLoadingModifierAssignment;

  const isModifierGroupsLoading =
    modifierGroupsQuery.isPending ||
    Boolean(props.id && productModifierGroupsQuery.isPending);
  const isModifierGroupsError =
    modifierGroupsQuery.isError ||
    Boolean(props.id && productModifierGroupsQuery.isError);

  const refetchModifierGroups = () => {
    modifierGroupsQuery.refetch();
    if (props.id) productModifierGroupsQuery.refetch();
  };

  const handleRemoveProductIngredient = (index: number) => {
    const item = productIngredientsValues[index];

    if (item.id) {
      setDeletedProductIngredientIds((prev) => [...prev, item.id!]);
    }

    remove(index);
  };

  const handleModifierGroupChange = (ids: string[]) => {
    setSelectedModifierGroupIds(ids);
  };

  const handleStockManagementChange = (value: string) => {
    if (value !== "MANUAL") {
      setValue("stock", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    const hasProductChanges = Object.keys(dirtyFields).length > 0;
    const isAssignmentReady =
      !props.id || productModifierGroupsQuery.isSuccess;
    const hasAssignmentChanges =
      canManage &&
      isAssignmentReady &&
      !areSameIds(initialModifierGroupIds, selectedModifierGroupIds);

    if (props.id && !hasProductChanges && !hasAssignmentChanges) {
      toast.info("Tidak ada perubahan untuk disimpan");
      return;
    }

    const toastId = toast.loading(
      props.id ? "Memperbarui produk..." : "Membuat produk...",
    );

    try {
      let productId = props.id;

      if (props.id) {
        if (hasProductChanges) {
          const editPayload: EditProduct = {
            id: props.id,
            ...(dirtyFields.name && {
              name: values.name,
            }),
            ...(dirtyFields.sellingPrice && {
              sellingPrice: values.sellingPrice ?? 0,
            }),
            ...(dirtyFields.isActive && {
              isActive: values.isActive,
            }),
            ...(dirtyFields.stockManagement && {
              stockManagement: values.stockManagement,
            }),
            ...(dirtyFields.inventoryPolicy && {
              inventoryPolicy: values.inventoryPolicy,
            }),
            ...(dirtyFields.stock &&
              values.stockManagement === "MANUAL" && {
                stock: values.stock ?? 0,
              }),
            ...(dirtyFields.productIngredients && {
              productIngredients: toEditProductIngredients(
                values.productIngredients,
                dirtyFields.productIngredients,
              ),
            }),
          };

          await editProduct.mutateAsync({
            ...editPayload,
            ...(deletedProductIngredientIds.length && {
              deletedProductIngredientIds,
            }),
          });
        }
      } else {
        const createdProduct = await createProduct.mutateAsync(
          toCreateProduct(values),
        );
        productId = createdProduct.id;
      }

      const shouldUpdateAssignments =
        canManage &&
        Boolean(productId) &&
        (props.id
          ? isAssignmentReady && hasAssignmentChanges
          : selectedModifierGroupIds.length > 0);

      if (shouldUpdateAssignments && productId) {
        try {
          await replaceModifierGroups.mutateAsync({
            productId,
            modifierGroupIds: selectedModifierGroupIds,
          });
        } catch (assignmentError) {
          if (!props.id) {
            toast.error(
              "Produk berhasil dibuat, tetapi variasi gagal ditugaskan. Silakan edit produk untuk mengatur variasi.",
            );
            props.setIsFormOpen(false);
            return;
          }

          throw assignmentError;
        }
      }

      toast.success(
        props.id ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan",
      );
      props.setIsFormOpen(false);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (productQuery.isError && productQuery.error) {
      apiErrorHandler(productQuery.error);
    }
  }, [productQuery.isError, productQuery.error]);

  useEffect(() => {
    if (modifierGroupsQuery.isError && modifierGroupsQuery.error) {
      apiErrorHandler(modifierGroupsQuery.error);
    }
  }, [modifierGroupsQuery.isError, modifierGroupsQuery.error]);

  useEffect(() => {
    if (
      productModifierGroupsQuery.isError &&
      productModifierGroupsQuery.error
    ) {
      apiErrorHandler(productModifierGroupsQuery.error);
    }
  }, [
    productModifierGroupsQuery.isError,
    productModifierGroupsQuery.error,
  ]);

  const {
    data: inventoryItemOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useInventoryItemOptionsQuery(props.open ?? false);

  useEffect(() => {
    if (isErrorGetOptions && errorGetOptions) {
      apiErrorHandler(errorGetOptions);
    }
  }, [isErrorGetOptions, errorGetOptions]);

  return {
    control,
    fields,
    stockManagement,
    handleStockManagementChange,
    inventoryItemOptions,
    isLoading,
    isLoadingGetOptions,
    modifierGroupOptions,
    selectedModifierGroupIds,
    canManage,
    isModifierGroupsLoading,
    isModifierGroupsError,
    append,
    refetchModifierGroups,
    handleRemoveProductIngredient,
    handleModifierGroupChange,
    handleSubmit,
    onSubmit,
  };
}
