import useAuthStore from "@/store/auth-store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RegisterFormValues } from "./RegisterPage.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./RegisterPage.contants";
import { useState } from "react";
import { useRegisterMutation } from "@/services/auth";
import { toast } from "sonner"; // or your toast library

export default function useRegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // <-- ADDED: TanStack Query mutation
  const registerMutation = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState<boolean>(false);

  const onSubmit = async (values: RegisterFormValues) => {
    // <-- FIXED: Actually call the API instead of just console.logging
    try {
      const response = await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      console.log(">>> response : ", response);

      // Optional: auto-login after successful registration
      if (response.token) {
        await login(response.token);
      }

      toast.success("Account created successfully!");
      navigate("/users");
    } catch (error) {
      console.log(">>> error onSubmit : ", error);
      // Error is already handled in the mutation's onError,
      // but you can add UI-specific handling here
      toast.error("Failed to create account. Please try again.");
    }
  };

  // Use combined loading state: form submitting OR mutation pending
  const isLoading = isSubmitting || registerMutation.isPending;

  return {
    control,
    errors,
    isSubmitting: isLoading, // <-- FIXED: expose mutation loading state too
    showPassword,
    showPasswordConfirmation,
    handleSubmit,
    onSubmit,
    setShowPassword,
    setShowPasswordConfirmation,
  };
}
