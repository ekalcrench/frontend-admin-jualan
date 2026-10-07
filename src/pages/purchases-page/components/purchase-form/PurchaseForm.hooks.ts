import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  useInventoryItemOptionsQuery,
  useInventoryItemsQuery,
} from "@/services/inventory-items/inventoryItems.query";
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

function dateInputValue(value?: string) {
  return value ? value.slice(0, 10) : "";
}

export default function usePurchaseForm(props: PurchaseFormProps) {
  const createPurchase = useCreatePurchaseMutation();
  const editPurchase = useEditPurchaseMutation();
  const purchaseQuery = usePurchaseByIdQuery(props.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
    console.log(">>> watch", watch);
  }, [watch]);

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
      purchasedAt: dateInputValue(purchase.purchasedAt),
      purchaseItems: purchase.purchaseItems?.map((item: any) => ({
        inventoryItemId: item.inventoryItemId ?? item.inventoryItem?.id ?? "",
        quantity: Number(item.quantity ?? 1),
        unitCost: Number(item.unitCost ?? 0),
        receivedAt: dateInputValue(item.receivedAt),
        expiredAt: dateInputValue(item.expiredAt),
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
    const payload = {
      ...values,
      purchaseItems: values.purchaseItems.map((item) => ({
        ...item,
        quantity: Number(item.quantity ?? 0),
        unitCost: Number(item.unitCost ?? 0),
        expiredAt: item.expiredAt || undefined,
      })),
    };
    const toastId = toast.loading(
      props.id ? "Memperbarui pembelian..." : "Membuat pembelian...",
    );
    try {
      if (props.id)
        await editPurchase.mutateAsync({ id: props.id, ...payload });
      else await createPurchase.mutateAsync(payload);

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

  useEffect(() => {
    console.log(">>> errors : ", errors);
  }, [errors]);

  return {
    control,
    errors,
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
