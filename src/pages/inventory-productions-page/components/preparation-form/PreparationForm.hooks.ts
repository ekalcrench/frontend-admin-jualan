import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { InventoryUnit } from "@/types/inventoryItem";
import { useInventoryItemOptionsQuery } from "@/services/inventory-items/inventoryItems.query";
import {
  useCreatePreparationMutation,
  useEditPreparationMutation,
} from "@/services/preparations/preparations.mutation";
import { usePreparationByIdQuery } from "@/services/preparations/preparations.query";
import {
  CreatePreparation,
  EditPreparation,
  EditPreparationItems,
} from "@/services/preparations/preparations.types";
import { apiErrorHandler } from "@/utils/api";
import {
  emptyPreparationFormValues,
  emptyPreparationItem,
  preparationFormSchema,
} from "./PreparationForm.constants";
import {
  PreparationFormProps,
  PreparationFormValues,
} from "./PreparationForm.types";

export default function usePreparationForm(props: PreparationFormProps) {
  const createPreparation = useCreatePreparationMutation();
  const editPreparation = useEditPreparationMutation();
  const preparationQuery = usePreparationByIdQuery(props.id);
  const {
    data: inventoryItemOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useInventoryItemOptionsQuery(props.open);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PreparationFormValues>({
    resolver: zodResolver(
      preparationFormSchema,
    ) as Resolver<PreparationFormValues>,
    mode: "onBlur",
    defaultValues: emptyPreparationFormValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "preparationItems",
  });
  const watch = useWatch({ control });
  const preparationItemsValues = useWatch({
    control,
    name: "preparationItems",
  });
  const [deletedPreparationItemIds, setDeletedPreparationItemIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    console.log(">>> watch : ", watch);
  }, [watch]);

  useEffect(() => {
    if (!props.open) {
      setDeletedPreparationItemIds([]);
      return;
    }
    if (!props.id) {
      reset(emptyPreparationFormValues);
      return;
    }
    if (!preparationQuery.data || !inventoryItemOptions) return;

    const preparation = preparationQuery.data;
    const toOption = (id: string, name: string, unit: InventoryUnit) => ({
      label: `${name} (${inventoryUnitLabels[unit]})`,
      value: id,
    });

    reset({
      outputInventoryItemId: toOption(
        preparation.outputInventoryItem.id,
        preparation.outputInventoryItem.name,
        preparation.outputInventoryItem.unit,
      ),
      name: preparation.name ?? "",
      preparedAt: preparation.preparedAt,
      outputQuantity: preparation.outputQuantity,
      notes: preparation.notes ?? "",
      preparationItems: preparation.preparationItems.map((item) => ({
        id: item.id,
        inventoryItemId: toOption(
          item.inventoryItem.id,
          item.inventoryItem.name,
          item.inventoryItem.unit,
        ),
        quantity: item.quantity,
      })),
    });
  }, [
    props.id,
    props.open,
    preparationQuery.data,
    inventoryItemOptions,
    reset,
  ]);

  const isLoadingGetData = Boolean(
    props.id &&
    (preparationQuery.isPending ||
      preparationQuery.isFetching ||
      !preparationQuery.data),
  );
  const isLoading =
    isSubmitting ||
    createPreparation.isPending ||
    editPreparation.isPending ||
    isLoadingGetData;

  const handleRemovePreparationItem = (index: number) => {
    const item = preparationItemsValues?.[index];
    const itemId = item?.id;
    if (itemId) {
      setDeletedPreparationItemIds((previous) => [...previous, itemId]);
    }
    remove(index);
  };

  const onSubmit = async (values: PreparationFormValues) => {
    const toastId = toast.loading(
      props.id ? "Memperbarui produksi..." : "Membuat produksi...",
    );

    const preparationItems = values.preparationItems.map((item) => ({
      ...(item.id && { id: item.id }),
      inventoryItemId: item.inventoryItemId?.value ?? "",
      quantity: item.quantity ?? 0,
    }));

    try {
      if (props.id) {
        const editItems: EditPreparationItems[] = preparationItems;
        const payload: EditPreparation = {
          id: props.id,
          outputInventoryItemId: values.outputInventoryItemId?.value ?? "",
          name: values.name,
          preparedAt: values.preparedAt,
          outputQuantity: values.outputQuantity ?? 0,
          notes: values.notes,
          preparationItems: editItems,
          ...(deletedPreparationItemIds.length > 0 && {
            deletedPreparationItemIds,
          }),
        };
        await editPreparation.mutateAsync(payload);
      } else {
        const payload: CreatePreparation = {
          outputInventoryItemId: values.outputInventoryItemId?.value ?? "",
          name: values.name,
          preparedAt: values.preparedAt,
          outputQuantity: values.outputQuantity ?? 0,
          notes: values.notes,
          preparationItems: preparationItems.map((item) => ({
            inventoryItemId: item.inventoryItemId,
            quantity: item.quantity,
          })),
        };
        await createPreparation.mutateAsync(payload);
      }

      toast.success(
        props.id
          ? "Produksi berhasil diperbarui"
          : "Produksi berhasil ditambahkan",
      );
      props.setIsFormOpen(false);
    } catch (submitError) {
      apiErrorHandler(submitError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (preparationQuery.isError && preparationQuery.error) {
      apiErrorHandler(preparationQuery.error);
    }
  }, [preparationQuery.isError, preparationQuery.error]);

  useEffect(() => {
    if (isErrorGetOptions && errorGetOptions) {
      apiErrorHandler(errorGetOptions);
    }
  }, [isErrorGetOptions, errorGetOptions]);

  return {
    control,
    fields,
    preparationItemsValues,
    inventoryItemOptions,
    isLoading,
    isLoadingGetOptions,
    append,
    handleRemovePreparationItem,
    handleSubmit,
    onSubmit,
    emptyPreparationItem,
  };
}
