import { UserFormProps, UserFormValues } from "./UserForm.types";
import {
  emptyUserFormValues,
  userEditFormSchema,
  userFormSchema,
} from "./UserForm.constants";
import { apiErrorHandler } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUserOptionsQuery } from "@/services/users/users.query";
import { useCreateOrganizationUserMutation } from "@/services/organization-users/organizationUsers.mutation";
import { userOrganizationStatus } from "@/constants/user";

export default function useUserForm(props: UserFormProps) {
  const createOrganizationUser = useCreateOrganizationUserMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, dirtyFields },
  } = useForm<UserFormValues>({
    resolver: zodResolver(
      props.id ? userEditFormSchema : userFormSchema,
    ) as Resolver<UserFormValues>,
    mode: "onBlur",
    defaultValues: emptyUserFormValues,
  });

  const isLoading = isSubmitting || createOrganizationUser.isPending;

  const [prefix, setPrefix] = useState<string>("");
  const [debouncedPrefix, setDebouncedPrefix] = useState<string>("");

  const {
    data: userOptions,
    isLoading: isLoadingGetOptions,
    isError: isErrorGetOptions,
    error: errorGetOptions,
  } = useUserOptionsQuery(debouncedPrefix);

  useEffect(() => {
    if (isErrorGetOptions && errorGetOptions) apiErrorHandler(errorGetOptions);
  }, [isErrorGetOptions, errorGetOptions]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedPrefix(prefix);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [prefix]);

  const onSubmit = async (values: UserFormValues) => {
    console.log(">>> values : ", values);
    const toastId = toast.loading(
      props.id ? "Updating User..." : "Creating User...",
    );
    try {
      const organizationUser = await createOrganizationUser.mutateAsync({
        role: values.role.value,
        userId: values.userId.value,
        status: userOrganizationStatus.PENDING_APPROVAL,
      });
      console.log(">>> organizationUser : ", organizationUser);
      props.onSuccess?.(organizationUser);

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
    isLoadingGetOptions,
    userOptions,
    handleSubmit,
    onSubmit,
    setPrefix,
  };
}
