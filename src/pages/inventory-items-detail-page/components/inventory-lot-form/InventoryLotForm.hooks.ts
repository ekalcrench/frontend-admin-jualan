import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditInventoryLotMutation } from "@/services/inventory-lots/inventoryLots.mutation";
import { apiErrorHandler } from "@/utils/api";
import {
  emptyInventoryLotFormValues,
  inventoryLotFormSchema,
} from "./InventoryLotForm.constants";
import type {
  InventoryLotFormProps,
  InventoryLotFormValues,
} from "./InventoryLotForm.types";

export default function useInventoryLotForm(props: InventoryLotFormProps) {
  const editInventoryLot = useEditInventoryLotMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, dirtyFields },
  } = useForm<InventoryLotFormValues>({
    resolver: zodResolver(
      inventoryLotFormSchema,
    ) as Resolver<InventoryLotFormValues>,
    mode: "onBlur",
    defaultValues: emptyInventoryLotFormValues,
  });

  useEffect(() => {
    if (!props.open) return;

    reset({
      remainingQuantity: props.lot.remainingQuantity,
      receivedAt: props.lot.receivedAt,
      expiredAt: props.lot.expiredAt ?? "",
    });
  }, [props.lot, props.open, reset]);

  const isLoading = isSubmitting || editInventoryLot.isPending;

  const onSubmit = async (values: InventoryLotFormValues) => {
    if (Object.keys(dirtyFields).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan");
      return;
    }

    const toastId = toast.loading("Memperbarui lot stok...");
    try {
      await editInventoryLot.mutateAsync({
        id: props.lot.id,
        ...(dirtyFields.remainingQuantity && {
          remainingQuantity: values.remainingQuantity ?? 0,
        }),
        ...(dirtyFields.receivedAt && {
          receivedAt: values.receivedAt,
        }),
        ...(dirtyFields.expiredAt && {
          expiredAt: values.expiredAt || null,
        }),
      });

      toast.success("Lot stok berhasil diperbarui");
      props.setIsFormOpen(false);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    control,
    isLoading,
    handleSubmit,
    onSubmit,
  };
}
