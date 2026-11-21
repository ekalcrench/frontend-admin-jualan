import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateProductModifierOptionMutation,
  useEditProductModifierOptionMutation,
} from "@/services/product-modifiers/productModifiers.mutation";
import { CreateProductModifierOption } from "@/services/product-modifiers/productModifiers.types";
import { apiErrorHandler } from "@/utils/api";
import {
  emptyModifierOptionFormValues,
  modifierOptionFormSchema,
  toModifierOptionFormValues,
} from "./ModifierOptionForm.constants";
import type {
  OptionFormProps,
  OptionFormValues,
} from "./ModifierOptionForm.types";

export default function useModifierOptionForm(props: OptionFormProps) {
  const createOption = useCreateProductModifierOptionMutation();
  const editOption = useEditProductModifierOptionMutation();

  const {
    control,
    handleSubmit,
    reset,
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

  const isLoading = isSubmitting || createOption.isPending || editOption.isPending;

  const onSubmit = async (values: OptionFormValues) => {
    const payload: CreateProductModifierOption = {
      name: values.name,
      description: values.description?.trim() ? values.description.trim() : null,
      price: values.price ?? 0,
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
    handleSubmit,
    onSubmit,
  };
}
