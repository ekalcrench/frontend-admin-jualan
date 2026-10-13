import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
  EditPurchase,
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
  purchasedAt: string,
): CreatePurchaseItem {
  return {
    inventoryItemId: item.inventoryItemId?.value ?? "",
    quantity: item.quantity ?? 0,
    totalCost: item.totalCost ?? 0,
    receivedAt: item.isSameAsPurchaseAt ? purchasedAt : item.receivedAt,
    expiredAt: item.isHasNoExpired ? undefined : item.expiredAt || undefined,
  };
}

function toEditPurchaseItems(
  items: PurchaseItemFormValues[],
  dirtyItems: FieldNamesMarkedBoolean<PurchaseFormValues>["purchaseItems"],
  purchasedAt: string,
): EditPurchaseItem[] {
  return items.flatMap<EditPurchaseItem>((item, index): EditPurchaseItem[] => {
    const dirtyItem = dirtyItems?.[index];
    if (!dirtyItem) return [];

    if (!item.id || !item.inventoryLotId) {
      return [toCreatePurchaseItem(item, purchasedAt)];
    }

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
        ...((dirtyItem.receivedAt || dirtyItem.isSameAsPurchaseAt) && {
          receivedAt: item.isSameAsPurchaseAt ? purchasedAt : item.receivedAt,
        }),
        ...((dirtyItem.expiredAt || dirtyItem.isHasNoExpired) && {
          expiredAt: item.isHasNoExpired
            ? undefined
            : (item.expiredAt ?? undefined),
        }),
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
    setValue,
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
  const purchasedAt = useWatch({ control, name: "purchasedAt" });
  const purchaseItemsValues = useWatch({ control, name: "purchaseItems" });

  useEffect(() => {
    console.log(">>> purchaseItemsValues : ", purchaseItemsValues);
    purchaseItemsValues?.forEach((item, index) => {
      if (item.isSameAsPurchaseAt && item.receivedAt !== purchasedAt) {
        setValue(`purchaseItems.${index}.receivedAt`, purchasedAt, {
          shouldDirty: true,
        });
      }

      if (item.isHasNoExpired && item.expiredAt !== undefined) {
        setValue(`purchaseItems.${index}.expiredAt`, undefined, {
          shouldDirty: true,
        });
      }
    });
  }, [purchaseItemsValues, purchasedAt, setValue]);

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
        isSameAsPurchaseAt:
          item.inventoryLot.receivedAt === purchase.purchasedAt,
        receivedAt: item.inventoryLot.receivedAt,
        isHasNoExpired: !Boolean(item.inventoryLot.expiredAt),
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
    if (props.id && Object.keys(dirtyFields).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan");
      return;
    }
    const toastId = toast.loading(
      props.id ? "Memperbarui pembelian..." : "Membuat pembelian...",
    );
    try {
      if (props.id) {
        const editPayload: EditPurchase = {
          id: props.id,
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
              values.purchasedAt,
            ),
          }),
        };

        await editPurchase.mutateAsync(editPayload);
      } else {
        await createPurchase.mutateAsync({
          ...values,
          purchaseItems: values.purchaseItems.map((item) =>
            toCreatePurchaseItem(item, values.purchasedAt),
          ),
        });
      }
      toast.success(
        props.id
          ? "Pembelian berhasil diperbarui"
          : "Pembelian berhasil ditambahkan",
      );
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

  const {
    data: inventoryItemOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useInventoryItemOptionsQuery(props.open ?? false);

  useEffect(() => {
    if (isErrorGetOptions && errorGetOptions) apiErrorHandler(errorGetOptions);
  }, [isErrorGetOptions, errorGetOptions]);

  return {
    control,
    fields,
    purchaseItemsValues,
    inventoryItemOptions,
    isLoading,
    isLoadingGetOptions,
    append,
    handleSubmit,
    remove,
    onSubmit,
  };
}
