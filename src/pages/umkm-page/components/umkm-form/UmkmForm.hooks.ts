import {
  useCreateOrganizationMutation,
  useEditOrganizationMutation,
} from "@/services/organizations/organizations.mutation";
import { UmkmFormProps, UmkmFormValues } from "./UmkmForm.types";
import type { EditOrganization } from "@/services/organizations/organizations.types";
import {
  emptySocialMediaFormValues,
  emptyUmkmFormValues,
  umkmEditFormSchema,
  umkmFormSchema,
} from "./UmkmForm.constants";
import { apiErrorHandler } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOrganizationByIdQuery } from "@/services/organizations/organizations.query";
import { useEffect } from "react";
import { fileToBase64 } from "@/utils/image";
import useAuthStore from "@/store/auth-store";
import {
  socialMediaPlatformLabels,
  SocialMediaPlatform,
} from "@/constants/organization";

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialMedias",
  });

  useEffect(() => {
    if (!getOrganizationById.data) {
      reset(emptyUmkmFormValues);
      return;
    }

    const socialMedias = getOrganizationById.data.socialMedias ?? [];

    reset({
      name: getOrganizationById.data.name,
      username: getOrganizationById.data.username,
      email: getOrganizationById.data.email,
      address: getOrganizationById.data.address,
      phone: getOrganizationById.data.phone,
      socialMedias: socialMedias.length
        ? socialMedias.map((socialMedia) => ({
            platform: {
              label:
                socialMediaPlatformLabels[socialMedia.platform] ??
                socialMedia.platform,
              value: socialMedia.platform,
            },
            username: socialMedia.username,
          }))
        : [{ ...emptySocialMediaFormValues }],
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

  const organization = useAuthStore((state) => state.organization);
  const renewalOrganizationData = useAuthStore(
    (state) => state.renewalOrganizationData,
  );

  const onSubmit = async (values: UmkmFormValues) => {
    const toastId = toast.loading(
      props.id ? "Updating UMKM..." : "Creating UMKM...",
    );
    try {
      const socialMedias = values.socialMedias.map((socialMedia, index) => ({
        platform: socialMedia.platform?.value as SocialMediaPlatform,
        username: socialMedia.username,
        sortOrder: index,
      }));

      if (props.id) {
        const changedValues: EditOrganization = {};
        (Object.keys(dirtyFields) as Array<keyof UmkmFormValues>).forEach(
          (field) => {
            if (field !== "file" && field !== "socialMedias") {
              changedValues[field] = values[field];
            }
          },
        );

        if (dirtyFields.file && values.file) {
          changedValues.logoBase64 = await fileToBase64(values.file);
        }

        if (dirtyFields.socialMedias) {
          changedValues.socialMedias = socialMedias;
        }

        const res = await editOrganization.mutateAsync(changedValues);
        if (organization?.id === res.id) {
          renewalOrganizationData({
            ...organization,
            logoBase64: res.logoBase64,
            name: res.name,
          });
        }
      } else {
        const organization = await createOrganization.mutateAsync({
          name: values.name,
          username: values.username,
          email: values.email,
          address: values.address,
          phone: values.phone,
          logoBase64: await fileToBase64(values.file),
          socialMedias,
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
    fields,
    append,
    remove,
    isLoading,
    handleSubmit,
    onSubmit,
    logoBase64: getOrganizationById.data?.logoBase64,
  };
}
