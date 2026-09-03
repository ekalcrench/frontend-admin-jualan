import useAuthStore from "@/store/auth-store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginFormValues } from "./LoginPage.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginPage.contants";
import { useState } from "react";
import { useLoginMutation } from "@/services/auth/auth.mutation";
import { apiErrorHandler } from "@/utils/api";
import { toast } from "sonner";

export default function useLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (values: LoginFormValues) => {
    const toastId = toast.loading("Signing  in...");
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      console.log(">>> response di onSubmit : ", response);
      // Optional: auto-login after successful registration
      // if (response.token) {
      //   await login(response.token);
      // }
      // await login(values.email);
      // navigate("/users");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    control,
    errors,
    isSubmitting,
    showPassword,
    handleSubmit,
    onSubmit,
    setShowPassword,
  };
}
