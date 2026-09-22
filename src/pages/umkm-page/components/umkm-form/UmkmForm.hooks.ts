import {
  useCreateOrganizationMutation,
  useEditOrganizationMutation,
} from "@/services/organizations/organizations.mutation";
import { UmkmFormProps, UmkmFormValues } from "./UmkmForm.types";
import {
  emptyUmkmFormValues,
  umkmEditFormSchema,
  umkmFormSchema,
} from "./UmkmForm.constants";
import { apiErrorHandler } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOrganizationByIdQuery } from "@/services/organizations/organizations.query";
import { useEffect } from "react";

export default function useUmkmForm(props: UmkmFormProps) {
  const createOrganization = useCreateOrganizationMutation();
  const editOrganization = useEditOrganizationMutation(props.id);
  const getOrganizationById = useOrganizationByIdQuery(props.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<UmkmFormValues>({
    resolver: zodResolver(
      props.id ? umkmEditFormSchema : umkmFormSchema,
    ) as Resolver<UmkmFormValues>,
    mode: "onBlur",
    defaultValues: emptyUmkmFormValues,
  });

  useEffect(() => {
    if (!getOrganizationById.data) {
      reset(emptyUmkmFormValues);
      return;
    }

    reset({
      name: getOrganizationById.data.name,
      email: getOrganizationById.data.email,
      address: getOrganizationById.data.address,
      phone: getOrganizationById.data.phone,
      file: undefined as unknown as File,
      logoUrl: getOrganizationById.data.logoUrl,
    });
  }, [getOrganizationById.data, reset]);

  const isLoadingGetData =
    (props.id &&
      (getOrganizationById.isPending || getOrganizationById.isFetching)) ||
    false;

  const isLoading =
    isSubmitting ||
    createOrganization.isPending ||
    editOrganization.isPending ||
    isLoadingGetData;

  const onSubmit = async (values: UmkmFormValues) => {
    const toastId = toast.loading(
      props.id ? "Updating UMKM..." : "Creating UMKM...",
    );
    try {
      if (props.id) {
        const changedValues = Object.fromEntries(
          Object.keys(dirtyFields).map((field) => [
            field,
            values[field as keyof UmkmFormValues],
          ]),
        );

        await editOrganization.mutateAsync(changedValues);
      } else {
        const organization = await createOrganization.mutateAsync(values);
        props.onSuccess?.(organization);
      }

      reset();
      props.setIsFormOpen(false);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    control,
    errors,
    isLoading,
    handleSubmit,
    onSubmit,
    logoUrl: getOrganizationById.data?.logoUrl,
  };
}
