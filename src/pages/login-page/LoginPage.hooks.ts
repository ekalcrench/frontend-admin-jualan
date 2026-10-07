import useAuthStore from "@/store/auth-store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginFormValues } from "./LoginPage.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginPage.contants";
import { useState } from "react";
import {
  useLoginMutation,
  useLoginOrganizationMutation,
} from "@/services/auth/auth.mutation";
import { apiErrorHandler } from "@/utils/api";
import { toast } from "sonner";
import { paths } from "@/constants/path";
import { fetchOrganizationsById } from "@/services/users/users.api";
import { userKeys } from "@/services/users/users.constants";
import { useQueryClient } from "@tanstack/react-query";
import { SelectedUserOrganization } from "@/types/user";

export default function useLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginOrganization = useAuthStore((state) => state.loginOrganization);
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const loginMutation = useLoginMutation();
  const loginOrganizationMutation = useLoginOrganizationMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isLoading = isSubmitting || loginMutation.isPending;

  const onLoginOrganization = async (
    organization: SelectedUserOrganization,
  ) => {
    const response = await loginOrganizationMutation.mutateAsync({
      organizationId: organization.id,
    });

    if (response.accessToken) {
      loginOrganization(organization, response.accessToken);
      navigate(paths.dashboard, { replace: true });
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    const toastId = toast.loading("Signing  in...");
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      login(response.user, response.accessToken);

      if (response.accessToken) {
        const organizations = await fetchOrganizationsById(response.user.id);

        console.log(">>> organizations : ", organizations);

        queryClient.setQueryData(
          userKeys.organizations(response.user.id),
          organizations,
        );

        if (organizations.length === 1) {
          await onLoginOrganization(organizations[0]);
          return;
        }

        if (organizations.length === 0) {
          toast.error(
            "User belum terdaftar di organisasi, hubungi admin untuk bertanya",
          );
          logout();
          return;
        }
      }

      navigate(paths.selectOrganizations, { replace: true });
    } catch (error) {
      logout();
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    control,
    isLoading,
    showPassword,
    handleSubmit,
    onSubmit,
    setShowPassword,
  };
}
