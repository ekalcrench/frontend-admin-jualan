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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read the selected logo"));
        return;
      }

      const base64 = reader.result.split(",")[1];
      if (!base64) {
        reject(new Error("Could not encode the selected logo"));
        return;
      }

      resolve(base64);
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read the selected logo"));
    reader.readAsDataURL(file);
  });
}

export default function useUmkmForm(props: UmkmFormProps) {
  const createOrganization = useCreateOrganizationMutation();
  const editOrganization = useEditOrganizationMutation(props.id);
  const getOrganizationById = useOrganizationByIdQuery(props.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, dirtyFields },
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
        const changedValues: Record<string, string> = {};
        (Object.keys(dirtyFields) as Array<keyof UmkmFormValues>).forEach(
          (field) => {
            if (field !== "file") {
              changedValues[field] = values[field];
            }
          },
        );

        if (dirtyFields.file && values.file) {
          changedValues.logoBase64 = await fileToBase64(values.file);
        }

        await editOrganization.mutateAsync(changedValues);
      } else {
        const organization = await createOrganization.mutateAsync({
          name: values.name,
          email: values.email,
          address: values.address,
          phone: values.phone,
          logoBase64: await fileToBase64(values.file),
        });
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
    isLoading,
    handleSubmit,
    onSubmit,
    logoBase64: getOrganizationById.data?.logoBase64,
  };
}
