import { useOrganizationsMutation } from "@/services/organizations/organizations.mutation";
import { UmkmFormProps, UmkmFormValues } from "./UmkmForm.types";
import { emptyUmkmFormValues, umkmFormSchema } from "./UmkmForm.constants";
import { apiErrorHandler } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function useUmkmForm(props: UmkmFormProps) {
  const createOrganization = useOrganizationsMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UmkmFormValues>({
    resolver: zodResolver(umkmFormSchema),
    mode: "onBlur",
    defaultValues: emptyUmkmFormValues,
  });

  const isLoading = isSubmitting || createOrganization.isPending;

  const onSubmit = async (values: UmkmFormValues) => {
    const toastId = toast.loading("Creating UMKM...");
    try {
      await createOrganization.mutateAsync(values);

      reset();
      props.setIsFormOpen(false);
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return { control, errors, isLoading, handleSubmit, onSubmit };
}
