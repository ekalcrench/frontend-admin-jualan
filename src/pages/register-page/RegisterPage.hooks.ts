import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RegisterFormValues } from "./RegisterPage.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./RegisterPage.contants";
import { useState } from "react";
import { useRegisterMutation } from "@/services/auth";
import { toast } from "sonner"; // or your toast library
import { paths } from "@/constants/path";

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
    try {
      const response = await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      console.log(">>> response : ", response);

      toast.success("Cek email Anda untuk melihat OTP");

      navigate(`${paths.registerVerify}?email=${values.email}`);
    } catch (error) {
      console.log(">>> error onSubmit : ", error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  return {
    control,
    errors,
    isSubmitting: isLoading,
    showPassword,
    showPasswordConfirmation,
    handleSubmit,
    onSubmit,
    setShowPassword,
    setShowPasswordConfirmation,
  };
}
