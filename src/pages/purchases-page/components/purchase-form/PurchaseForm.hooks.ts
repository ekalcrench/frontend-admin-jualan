import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useInventoryItemOptionsQuery } from "@/services/inventory-items/inventoryItems.query";
import {
  useCreatePurchaseMutation,
  useEditPurchaseMutation,
} from "@/services/purchases/purchases.mutation";
import { usePurchaseByIdQuery } from "@/services/purchases/purchases.query";
import { apiErrorHandler } from "@/utils/api";
import { PurchaseFormProps, PurchaseFormValues } from "./PurchaseForm.types";
import {
  emptyPurchaseFormValues,
  emptyPurchaseItem,
  purchaseFormSchema,
} from "./PurchaseForm.constants";
import { inventoryUnitLabels } from "@/constants/inventoryItem";

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
  const watch = useWatch({ control });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "purchaseItems",
  });

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
    const purchaseItems = values.purchaseItems.map((item) => ({
      ...item,
      quantity: item.quantity ?? 0,
      totalCost: item.totalCost ?? 0,
      expiredAt: item.expiredAt || undefined,
      inventoryItemId: item.inventoryItemId?.value ?? "",
    }));
    const payload = props.id
      ? {
          ...(dirtyFields.supplierName && {
            supplierName: values.supplierName,
          }),
          ...(dirtyFields.invoiceNumber && {
            invoiceNumber: values.invoiceNumber,
          }),
          ...(dirtyFields.purchasedAt && { purchasedAt: values.purchasedAt }),
          ...(dirtyFields.purchaseItems && { purchaseItems }),
        }
      : { ...values, purchaseItems };
    const toastId = toast.loading(
      props.id ? "Memperbarui pembelian..." : "Membuat pembelian...",
    );
    try {
      if (props.id)
        await editPurchase.mutateAsync({ id: props.id, ...payload });
      else await createPurchase.mutateAsync({ ...values, purchaseItems });
      toast.success(
        props.id
          ? "Pembelian berhasil diperbarui"
          : "Pembelian berhasil ditambahkan",
      );
      reset(emptyPurchaseFormValues);
      props.setIsFormOpen(false);
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
