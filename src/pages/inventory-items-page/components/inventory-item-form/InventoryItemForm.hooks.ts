import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateInventoryItemMutation,
  useEditInventoryItemMutation,
} from "@/services/inventory-items/inventoryItems.mutation";
import { apiErrorHandler } from "@/utils/api";
import {
  emptyInventoryItemFormValues,
  inventoryItemFormSchema,
  InventoryItemFormValues,
} from "./InventoryItemForm.constants";
import { InventoryItemFormProps } from "./InventoryItemForm.types";

export default function useInventoryItemForm(props: InventoryItemFormProps) {
  const createInventoryItem = useCreateInventoryItemMutation();
  const editInventoryItem = useEditInventoryItemMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(
      inventoryItemFormSchema,
    ) as Resolver<InventoryItemFormValues>,
    mode: "onBlur",
    defaultValues: emptyInventoryItemFormValues,
  });

  useEffect(() => {
    if (!props.open) return;

    reset(
      props.item
        ? { name: props.item.name, unit: props.item.unit }
        : emptyInventoryItemFormValues,
    );
  }, [props.item, props.open, reset]);

  const isLoading =
    isSubmitting ||
    createInventoryItem.isPending ||
    editInventoryItem.isPending;

  const onSubmit = async (values: InventoryItemFormValues) => {
    const toastId = toast.loading(
      props.item ? "Memperbarui barang..." : "Membuat barang...",
    );
    try {
      if (props.item) {
        await editInventoryItem.mutateAsync({ id: props.item.id, ...values });
      } else {
        await createInventoryItem.mutateAsync(values);
      }

      toast.success(
        props.item
          ? "Berhasil memperbarui barang"
          : "Berhasil menambahkan barang",
      );
      reset(emptyInventoryItemFormValues);
      props.setIsFormOpen(false);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return { control, errors, isLoading, handleSubmit, onSubmit };
}
