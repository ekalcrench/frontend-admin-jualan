import { useOrganizationsByUserIdQuery } from "@/services/users/users.query";
import useAuthStore from "@/store/auth-store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { paths } from "@/constants/path";
import { SelectOrganizationFormValues } from "./SelectOrganizationsPage.types";
import { selectOrganizationSchema } from "./SelectOrganizationsPage.constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectedUserOrganization } from "@/types/user";

export default function useSelectOrganizationsPage() {
  const user = useAuthStore((state) => state.user);
  const loginOrganization = useAuthStore((state) => state.loginOrganization);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SelectOrganizationFormValues>({
    resolver: zodResolver(selectOrganizationSchema),
    defaultValues: { organization: undefined },
  });
  const organizationsQuery = useOrganizationsByUserIdQuery(user?.id);

  const selectOrganization = (
    organization: SelectedUserOrganization | null,
  ) => {
    if (!organization) return;

    loginOrganization(organization);
    navigate(paths.dashboard, { replace: true });
  };

  const onSubmit = (values: SelectOrganizationFormValues) => {
    console.log(">>> values : ", values);
    selectOrganization(values.organization);
  };

  return {
    control,
    errors,
    isLoading: organizationsQuery.isLoading,
    isSubmitting,
    organizations: organizationsQuery.data ?? [],
    handleSubmit,
    onSubmit,
  };
}
