import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { useInventoryItemOptionsQuery } from "@/services/inventory-items/inventoryItems.query";
import {
  useCreateProductModifierOptionMutation,
  useEditProductModifierOptionMutation,
} from "@/services/product-modifiers/productModifiers.mutation";
import { CreateProductModifierOption } from "@/services/product-modifiers/productModifiers.types";
import type { InventoryUnit } from "@/types/inventoryItem";
import type { LabelValue } from "@/types/generalTypes";
import { apiErrorHandler } from "@/utils/api";
import {
  emptyModifierOptionFormValues,
  modifierOptionFormSchema,
  NO_INVENTORY_OPTION,
  toModifierOptionFormValues,
} from "./ModifierOptionForm.constants";
import type {
  OptionFormProps,
  OptionFormValues,
} from "./ModifierOptionForm.types";

export default function useModifierOptionForm(props: OptionFormProps) {
  const createOption = useCreateProductModifierOptionMutation();
  const editOption = useEditProductModifierOptionMutation();
  const inventoryItemsQuery = useInventoryItemOptionsQuery(Boolean(props.open));

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<OptionFormValues>({
    resolver: zodResolver(
      modifierOptionFormSchema,
    ) as Resolver<OptionFormValues>,
    mode: "onBlur",
    defaultValues: emptyModifierOptionFormValues,
  });

  const loadedOptionIdRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!props.open) {
      wasOpenRef.current = false;
      loadedOptionIdRef.current = null;
      return;
    }

    const optionId = props.option?.id ?? null;
    const shouldLoad =
      !wasOpenRef.current || loadedOptionIdRef.current !== optionId;

    if (!shouldLoad) return;

    reset(toModifierOptionFormValues(props.option));
    wasOpenRef.current = true;
    loadedOptionIdRef.current = optionId;
  }, [props.open, props.option, reset]);

  useEffect(() => {
    if (inventoryItemsQuery.isError && inventoryItemsQuery.error) {
      apiErrorHandler(inventoryItemsQuery.error);
    }
  }, [inventoryItemsQuery.isError, inventoryItemsQuery.error]);

  const inventoryItemOptions = useMemo<LabelValue<string>[]>(() => {
    const options: LabelValue<string>[] = [NO_INVENTORY_OPTION];
    const seenIds = new Set<string>([NO_INVENTORY_OPTION.value]);

    (inventoryItemsQuery.data ?? []).forEach((item) => {
      if (seenIds.has(item.id)) return;

      seenIds.add(item.id);
      options.push({
        label: `${item.name} (${inventoryUnitLabels[item.unit]})`,
        value: item.id,
      });
    });

    // Keep a previously configured item selectable even when it has since been
    // deactivated and is no longer returned by the options endpoint.
    const currentItem = props.option?.inventoryItem;
    if (currentItem && !seenIds.has(currentItem.id)) {
      options.push({
        label: `${currentItem.name} (${inventoryUnitLabels[currentItem.unit]})`,
        value: currentItem.id,
      });
    }

    return options;
  }, [inventoryItemsQuery.data, props.option]);

  const selectedInventoryItem = useWatch({
    control,
    name: "inventoryItemId",
  });
  const trackInventory = useWatch({
    control,
    name: "trackInventory",
  });

  const selectedInventoryItemId = selectedInventoryItem?.value || null;
  const hasSelectedInventoryItem = Boolean(selectedInventoryItemId);

  const selectedInventoryItemUnit = useMemo<InventoryUnit | null>(() => {
    if (!selectedInventoryItemId) return null;

    const inventoryItem = inventoryItemsQuery.data?.find(
      (item) => item.id === selectedInventoryItemId,
    );
    if (inventoryItem) return inventoryItem.unit;

    if (props.option?.inventoryItem?.id === selectedInventoryItemId) {
      return props.option.inventoryItem.unit;
    }

    return null;
  }, [inventoryItemsQuery.data, props.option, selectedInventoryItemId]);

  const handleInventoryItemChange = (value: LabelValue<string> | null) => {
    if (value?.value) return;

    setValue("inventoryQuantity", null, {
      shouldDirty: true,
      shouldValidate: false,
    });
    setValue("trackInventory", false, {
      shouldDirty: true,
      shouldValidate: false,
    });
  };

  const isLoading = isSubmitting || createOption.isPending || editOption.isPending;
  const isInventoryItemsEmpty =
    inventoryItemsQuery.isSuccess && (inventoryItemsQuery.data?.length ?? 0) === 0;

  const onSubmit = async (values: OptionFormValues) => {
    const inventoryItemId = values.inventoryItemId?.value || null;
    const payload: CreateProductModifierOption = {
      name: values.name,
      description: values.description?.trim() ? values.description.trim() : null,
      price: values.price ?? 0,
      inventoryItemId,
      inventoryQuantity: inventoryItemId
        ? (values.inventoryQuantity ?? null)
        : null,
      trackInventory: inventoryItemId ? values.trackInventory : false,
      inventoryPolicy: values.inventoryPolicy,
      isActive: values.isActive,
    };

    const toastId = toast.loading(
      props.option ? "Memperbarui opsi variasi..." : "Menambahkan opsi variasi...",
    );

    try {
      if (props.option) {
        await editOption.mutateAsync({
          id: props.option.id,
          ...payload,
        });
      } else {
        await createOption.mutateAsync({
          modifierGroupId: props.modifierGroupId,
          ...payload,
          sortOrder: props.nextSortOrder,
        });
      }

      toast.success(
        props.option
          ? "Opsi variasi berhasil diperbarui"
          : "Opsi variasi berhasil ditambahkan",
      );
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
    isLoadingInventoryItems: inventoryItemsQuery.isLoading,
    isInventoryItemsEmpty,
    inventoryItemOptions,
    hasSelectedInventoryItem,
    trackInventory,
    selectedInventoryItemUnit,
    handleInventoryItemChange,
    handleSubmit,
    onSubmit,
  };
}
