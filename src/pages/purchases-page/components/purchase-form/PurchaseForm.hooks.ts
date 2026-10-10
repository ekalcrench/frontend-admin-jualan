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
import { useInventoryItemOptionsQuery } from "@/services/inventory-items/inventoryItems.query";
import {
  useCreatePurchaseMutation,
  useEditPurchaseMutation,
} from "@/services/purchases/purchases.mutation";
import { usePurchaseByIdQuery } from "@/services/purchases/purchases.query";
import {
  CreatePurchaseItem,
  EditPurchaseItem,
} from "@/services/purchases/purchases.types";
import { apiErrorHandler } from "@/utils/api";
import {
  PurchaseFormProps,
  PurchaseFormValues,
  PurchaseItemFormValues,
} from "./PurchaseForm.types";
import {
  emptyPurchaseFormValues,
  emptyPurchaseItem,
  purchaseFormSchema,
} from "./PurchaseForm.constants";
import { inventoryUnitLabels } from "@/constants/inventoryItem";

function toCreatePurchaseItem(
  item: PurchaseItemFormValues,
): CreatePurchaseItem {
  return {
    inventoryItemId: item.inventoryItemId?.value ?? "",
    quantity: item.quantity ?? 0,
    totalCost: item.totalCost ?? 0,
    receivedAt: item.receivedAt,
    expiredAt: item.expiredAt || undefined,
  };
}

function toEditPurchaseItems(
  items: PurchaseItemFormValues[],
  dirtyItems: FieldNamesMarkedBoolean<PurchaseFormValues>["purchaseItems"],
): EditPurchaseItem[] {
  console.log(">>> items : ", items);
  console.log(">>> dirtyItems : ", dirtyItems);
  return items.flatMap<EditPurchaseItem>((item, index): EditPurchaseItem[] => {
    const dirtyItem = dirtyItems?.[index];
    if (!dirtyItem) return [];

    if (!item.id || !item.inventoryLotId) return [toCreatePurchaseItem(item)];

    return [
      {
        id: item.id,
        inventoryLotId: item.inventoryLotId,
        ...(dirtyItem.inventoryItemId && {
          inventoryItemId: item.inventoryItemId?.value ?? "",
        }),
        ...(dirtyItem.quantity && dirtyItem.totalCost
          ? {
              quantity: item.quantity ?? 0,
              totalCost: item.totalCost ?? 0,
            }
          : (dirtyItem.quantity || dirtyItem.totalCost) && {
              quantity: item.quantity ?? 0,
              totalCost: item.totalCost ?? 0,
            }),
        ...(dirtyItem.receivedAt && { receivedAt: item.receivedAt }),
        ...(dirtyItem.expiredAt && { expiredAt: item.expiredAt ?? undefined }),
      },
    ];
  });
}

export default function usePurchaseForm(props: PurchaseFormProps) {
  const createPurchase = useCreatePurchaseMutation();
  const editPurchase = useEditPurchaseMutation();
  const purchaseQuery = usePurchaseByIdQuery(props.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, dirtyFields },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema) as Resolver<PurchaseFormValues>,
    mode: "onBlur",
    defaultValues: emptyPurchaseFormValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "purchaseItems",
  });
  const watch = useWatch({ control });

  useEffect(() => {
    console.log(">>> watch : ", watch);
    console.log(">>> dirtyFields : ", dirtyFields);
  }, [watch, dirtyFields]);

  useEffect(() => {
    if (!props.open) return;
    if (!props.id) {
      reset(emptyPurchaseFormValues);
      return;
    }
    if (!purchaseQuery.data) return;

    const purchase = purchaseQuery.data;

    reset({
      supplierName: purchase.supplierName ?? "",
      invoiceNumber: purchase.invoiceNumber ?? "",
      purchasedAt: purchase.purchasedAt,
      purchaseItems: purchase.purchaseItems?.map((item) => ({
        id: item.id,
        inventoryLotId: item.inventoryLot.id,
        inventoryItemId: {
          label: `${item.inventoryItem.name} (${inventoryUnitLabels[item.inventoryItem.unit]})`,
          value: item.inventoryItem.id,
        },
        quantity: item.quantity,
        totalCost: item.totalCost,
        receivedAt: item.inventoryLot.receivedAt,
        expiredAt: item.inventoryLot.expiredAt,
      })) ?? [{ ...emptyPurchaseItem }],
    });
  }, [props.id, props.open, purchaseQuery.data, reset]);

  const isLoadingGetData = Boolean(
    props.id && (purchaseQuery.isPending || purchaseQuery.isFetching),
  );
  const isLoading =
    isSubmitting ||
    createPurchase.isPending ||
    editPurchase.isPending ||
    isLoadingGetData;

  const onSubmit = async (values: PurchaseFormValues) => {
    console.log(">>> values di onSubmit : ", values);
    const editPayload = {
      ...(dirtyFields.supplierName && {
        supplierName: values.supplierName,
      }),
      ...(dirtyFields.invoiceNumber && {
        invoiceNumber: values.invoiceNumber,
      }),
      ...(dirtyFields.purchasedAt && { purchasedAt: values.purchasedAt }),
      ...(dirtyFields.purchaseItems && {
        purchaseItems: toEditPurchaseItems(
          values.purchaseItems,
          dirtyFields.purchaseItems,
        ),
      }),
    };

    console.log(">>> editPayload : ", editPayload);

    if (props.id && Object.keys(dirtyFields).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan");
      return;
    }

    const toastId = toast.loading(
      props.id ? "Memperbarui pembelian..." : "Membuat pembelian...",
    );
    try {
      if (props.id)
        await editPurchase.mutateAsync({ id: props.id, ...editPayload });
      else
        await createPurchase.mutateAsync({
          ...values,
          purchaseItems: values.purchaseItems.map(toCreatePurchaseItem),
        });
      toast.success(
        props.id
          ? "Pembelian berhasil diperbarui"
          : "Pembelian berhasil ditambahkan",
      );
      // reset(emptyPurchaseFormValues);
      // props.setIsFormOpen(false);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (purchaseQuery.isError && purchaseQuery.error) {
      apiErrorHandler(purchaseQuery.error);
    }
  }, [purchaseQuery.isError, purchaseQuery.error]);

  const [prefix, setPrefix] = useState<string>("");
  const [debouncedPrefix, setDebouncedPrefix] = useState<string>("");

  const {
    data: inventoryItemOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useInventoryItemOptionsQuery(debouncedPrefix);

  useEffect(() => {
    if (isErrorGetOptions && errorGetOptions) apiErrorHandler(errorGetOptions);
  }, [isErrorGetOptions, errorGetOptions]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedPrefix(prefix);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [prefix]);

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
    setPrefix,
  };
}
