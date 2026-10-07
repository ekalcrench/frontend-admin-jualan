import { useOrganizationsByUserIdQuery } from "@/services/users/users.query";
import useAuthStore from "@/store/auth-store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { paths } from "@/constants/path";
import { SelectOrganizationFormValues } from "./SelectOrganizationsPage.types";
import { selectOrganizationSchema } from "./SelectOrganizationsPage.constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectedUserOrganization } from "@/types/user";
import { useLoginOrganizationMutation } from "@/services/auth";
import { toast } from "sonner";
import { apiErrorHandler } from "@/utils/api";

export default function useSelectOrganizationsPage() {
  const user = useAuthStore((state) => state.user);
  const loginOrganization = useAuthStore((state) => state.loginOrganization);

  const navigate = useNavigate();

  const loginOrganizationMutation = useLoginOrganizationMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SelectOrganizationFormValues>({
    resolver: zodResolver(selectOrganizationSchema),
    defaultValues: { organization: undefined },
  });
  const organizationsQuery = useOrganizationsByUserIdQuery(user?.id);

  const onSubmit = async (values: SelectOrganizationFormValues) => {
    console.log(">>> values : ", values);
    const toastId = toast.loading("Signing  in...");
    try {
      const response = await loginOrganizationMutation.mutateAsync({
        organizationId: values.organization.id,
      });

      if (response.accessToken) {
        loginOrganization(values.organization, response.accessToken);
        navigate(paths.dashboard, { replace: true });
      }
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    control,
    isLoading: organizationsQuery.isLoading,
    isSubmitting,
    organizations: organizationsQuery.data ?? [],
    handleSubmit,
    onSubmit,
  };
}
