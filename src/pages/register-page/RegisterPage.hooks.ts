import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RegisterFormValues } from "./RegisterPage.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./RegisterPage.contants";
import { useState } from "react";
import { useRegisterMutation } from "@/services/auth";
import { toast } from "sonner";
import { paths } from "@/constants/path";
import { apiErrorHandler } from "@/utils/api";

export default function useRegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const isLoading = isSubmitting || registerMutation.isPending;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false);

  const onSubmit = async (values: RegisterFormValues) => {
    const toastId = toast.loading("Loading...");
    try {
      await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      toast.success("Cek email Anda untuk melihat OTP");

      navigate(`${paths.registerVerify}?email=${values.email}`);
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
    showPassword,
    showPasswordConfirmation,
    handleSubmit,
    onSubmit,
    setShowPassword,
    setShowPasswordConfirmation,
  };
}
