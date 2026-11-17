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
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useOrganizationByIdQuery } from "@/services/organizations/organizations.query";
import { useEffect } from "react";
import { fileToBase64 } from "@/utils/image";
import useAuthStore from "@/store/auth-store";
import { EditOrganization } from "@/services/organizations/organizations.types";
import { socialMediaPlatforms } from "@/constants/organization";

export default function useUmkmForm(props: UmkmFormProps) {
  const createOrganization = useCreateOrganizationMutation();
  const editOrganization = useEditOrganizationMutation(props.id);
  const getOrganizationById = useOrganizationByIdQuery(props.id);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, dirtyFields },
  } = useForm<UmkmFormValues>({
    resolver: zodResolver(
      props.id ? umkmEditFormSchema : umkmFormSchema,
    ) as Resolver<UmkmFormValues>,
    mode: "onBlur",
    defaultValues: emptyUmkmFormValues,
  });

  const {
    fields: socialMediaFields,
    append: appendSocialMedia,
    remove: removeSocialMedia,
  } = useFieldArray({
    control,
    name: "socialMedias",
  });

  useEffect(() => {
    if (!getOrganizationById.data) {
      reset(emptyUmkmFormValues);
      return;
    }

    reset({
      name: getOrganizationById.data.name,
      username: getOrganizationById.data.username ?? "",
      email: getOrganizationById.data.email,
      address: getOrganizationById.data.address,
      phone: getOrganizationById.data.phone,
      socialMedias: [...(getOrganizationById.data.socialMedias ?? [])]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((socialMedia) => ({
          platform: socialMedia.platform,
          username: socialMedia.username,
        })),
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

  const handleClickAddSocialMedia = () => {
    const usedPlatforms = new Set(
      getValues("socialMedias").map((socialMedia) => socialMedia.platform),
    );
    const nextPlatform = socialMediaPlatforms.find(
      (platform) => !usedPlatforms.has(platform),
    );

    if (!nextPlatform) return;

    appendSocialMedia({ platform: nextPlatform, username: "" });
  };

  const handleClickRemoveSocialMedia = (index: number) => {
    removeSocialMedia(index);
  };

  const onSubmit = async (values: UmkmFormValues) => {
    const toastId = toast.loading(
      props.id ? "Updating UMKM..." : "Creating UMKM...",
    );

    const socialMedias = values.socialMedias.map((socialMedia, index) => ({
      platform: socialMedia.platform,
      username: socialMedia.username,
      sortOrder: index,
    }));

    try {
      if (props.id) {
        const changedValues: EditOrganization = {};

        if (dirtyFields.name) changedValues.name = values.name;
        if (dirtyFields.username) changedValues.username = values.username;
        if (dirtyFields.email) changedValues.email = values.email;
        if (dirtyFields.phone) changedValues.phone = values.phone;
        if (dirtyFields.address) changedValues.address = values.address;
        if (dirtyFields.socialMedias) {
          changedValues.socialMedias = socialMedias;
        }
        if (dirtyFields.file && values.file) {
          changedValues.logoBase64 = await fileToBase64(values.file);
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
        const createdOrganization = await createOrganization.mutateAsync({
          name: values.name,
          username: values.username,
          email: values.email,
          address: values.address,
          phone: values.phone,
          socialMedias,
          logoBase64: await fileToBase64(values.file),
        });
        props.onSuccess?.(createdOrganization);
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
    socialMediaFields,
    isSocialMediaFull:
      socialMediaFields.length >= socialMediaPlatforms.length,
    handleClickAddSocialMedia,
    handleClickRemoveSocialMedia,
    logoBase64: getOrganizationById.data?.logoBase64,
  };
}
