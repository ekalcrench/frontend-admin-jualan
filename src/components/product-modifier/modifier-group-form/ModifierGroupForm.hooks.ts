import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateProductModifierGroupMutation,
  useEditProductModifierGroupMutation,
} from "@/services/product-modifiers/productModifiers.mutation";
import { CreateProductModifierGroup } from "@/services/product-modifiers/productModifiers.types";
import { apiErrorHandler } from "@/utils/api";
import {
  emptyModifierGroupFormValues,
  modifierGroupFormSchema,
  toModifierGroupFormValues,
} from "./ModifierGroupForm.constants";
import type {
  ModifierGroupFormProps,
  ModifierGroupFormValues,
} from "./ModifierGroupForm.types";

export default function useModifierGroupForm(props: ModifierGroupFormProps) {
  const createModifierGroup = useCreateProductModifierGroupMutation();
  const editModifierGroup = useEditProductModifierGroupMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm<ModifierGroupFormValues>({
    resolver: zodResolver(
      modifierGroupFormSchema,
    ) as Resolver<ModifierGroupFormValues>,
    mode: "onBlur",
    defaultValues: emptyModifierGroupFormValues,
  });

  const isRequired = useWatch({
    control,
    name: "isRequired",
    defaultValue: false,
  });
  const isMultiple = useWatch({
    control,
    name: "isMultiple",
    defaultValue: false,
  });
  const minSelection = useWatch({
    control,
    name: "minSelection",
    defaultValue: 0,
  });
  const maxSelection = useWatch({
    control,
    name: "maxSelection",
    defaultValue: 1,
  });

  const loadedGroupIdRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!props.open) {
      wasOpenRef.current = false;
      loadedGroupIdRef.current = null;
      return;
    }

    const groupId = props.group?.id ?? null;
    const shouldLoad =
      !wasOpenRef.current || loadedGroupIdRef.current !== groupId;

    if (!shouldLoad) return;

    reset(toModifierGroupFormValues(props.group));
    wasOpenRef.current = true;
    loadedGroupIdRef.current = groupId;
  }, [props.open, props.group, reset]);

  useEffect(() => {
    if (!props.open || !isDirty) return;

    if (!isMultiple) {
      const expectedMin = isRequired ? 1 : 0;

      if (maxSelection !== 1) {
        setValue("maxSelection", 1);
      }
      if (minSelection !== expectedMin) {
        setValue("minSelection", expectedMin);
      }
      return;
    }

    const safeMin = minSelection ?? 0;
    const safeMax = maxSelection ?? 1;

    if (isRequired && safeMin < 1) {
      setValue("minSelection", 1);
    }
    if (safeMax < 1) {
      setValue("maxSelection", Math.max(safeMin, 1));
      return;
    }
    if (safeMax < safeMin) {
      setValue("maxSelection", safeMin);
    }
  }, [
    props.open,
    isDirty,
    isMultiple,
    isRequired,
    minSelection,
    maxSelection,
    setValue,
  ]);

  const isLoading =
    isSubmitting ||
    createModifierGroup.isPending ||
    editModifierGroup.isPending;

  const onSubmit = async (values: ModifierGroupFormValues) => {
    const payload: CreateProductModifierGroup = {
      name: values.name,
      description: values.description?.trim()
        ? values.description.trim()
        : null,
      isRequired: values.isRequired,
      isMultiple: values.isMultiple,
      minSelection: values.isMultiple
        ? (values.minSelection ?? 0)
        : values.isRequired
          ? 1
          : 0,
      maxSelection: values.isMultiple ? (values.maxSelection ?? 1) : 1,
      isActive: values.isActive,
    };

    const toastId = toast.loading(
      props.group ? "Memperbarui grup variasi..." : "Membuat grup variasi...",
    );

    try {
      if (props.group) {
        await editModifierGroup.mutateAsync({
          id: props.group.id,
          ...payload,
        });
      } else {
        await createModifierGroup.mutateAsync(payload);
      }

      toast.success(
        props.group
          ? "Grup variasi berhasil diperbarui"
          : "Grup variasi berhasil dibuat",
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
    isRequired,
    isMultiple,
    isLoading,
    handleSubmit,
    onSubmit,
  };
}
