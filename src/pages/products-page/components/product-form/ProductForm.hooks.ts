import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  FieldNamesMarkedBoolean,
  Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { useInventoryItemOptionsQuery } from "@/services/inventory-items/inventoryItems.query";
import {
  useCreateProductMutation,
  useEditProductMutation,
} from "@/services/products/products.mutation";
import { useProductByIdQuery } from "@/services/products/products.query";
import type {
  CreateProduct,
  CreateProductIngredients,
  EditProduct,
  EditProductIngredients,
} from "@/services/products/products.types";
import { apiErrorHandler } from "@/utils/api";
import {
  emptyProductFormValues,
  emptyProductIngredient,
  productFormSchema,
} from "./ProductForm.constants";
import type {
  ProductFormProps,
  ProductFormValues,
  ProductIngredientFormValues,
} from "./ProductForm.types";

function toCreateProduct(values: ProductFormValues): CreateProduct {
  return {
    name: values.name,
    sellingPrice: values.sellingPrice ?? 0,
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
  console.log(">>> items : ", items);
  console.log(">>> dirtyItems : ", dirtyItems);
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
  const productQuery = useProductByIdQuery(props.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
    mode: "onBlur",
    defaultValues: emptyProductFormValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productIngredients",
  });
  const watch = useWatch({ control });

  useEffect(() => {
    console.log(">>> watch : ", watch);
    console.log(">>> errors : ", errors);
    console.log(">>> dirtyFields : ", dirtyFields);
  }, [watch, errors, dirtyFields]);

  useEffect(() => {
    if (!props.open) return;
    if (!props.id) {
      reset(emptyProductFormValues);
      return;
    }
    if (!productQuery.data) return;

    const product = productQuery.data;
    reset({
      name: product.name,
      sellingPrice: product.sellingPrice,
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

  const isLoadingGetData = Boolean(
    props.id &&
    (!productQuery.data || productQuery.isPending || productQuery.isFetching),
  );
  const isLoading =
    isSubmitting ||
    createProduct.isPending ||
    editProduct.isPending ||
    isLoadingGetData;

  const onSubmit = async (values: ProductFormValues) => {
    console.log(">>> values di onSubmit : ", values);
    if (props.id && Object.keys(dirtyFields).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan");
      return;
    }

    const toastId = toast.loading(
      props.id ? "Memperbarui produk..." : "Membuat produk...",
    );
    try {
      if (props.id) {
        const editPayload: EditProduct = {
          id: props.id,
          ...(dirtyFields.name && {
            name: values.name,
          }),
          ...(dirtyFields.sellingPrice && {
            sellingPrice: values.sellingPrice ?? 0,
          }),
          ...(dirtyFields.productIngredients && {
            productIngredients: toEditProductIngredients(
              values.productIngredients,
              dirtyFields.productIngredients,
            ),
          }),
        };

        console.log(">>> editPayload : ", editPayload);
        await editProduct.mutateAsync(editPayload);
      } else {
        await createProduct.mutateAsync(toCreateProduct(values));
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

  const {
    data: inventoryItemOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useInventoryItemOptionsQuery();

  useEffect(() => {
    if (isErrorGetOptions && errorGetOptions) {
      apiErrorHandler(errorGetOptions);
    }
  }, [isErrorGetOptions, errorGetOptions]);

  return {
    control,
    fields,
    inventoryItemOptions,
    isLoading,
    isLoadingGetOptions,
    append,
    handleSubmit,
    remove,
    onSubmit,
  };
}
