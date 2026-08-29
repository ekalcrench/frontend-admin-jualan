import useAuthStore from "@/store/auth-store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginFormValues } from "./LoginPage.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginPage.contants";
import { useState } from "react";

export default function useLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

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
    console.log(">>> values di onSubmit : ", values);
    await login(values.email);
    navigate("/users");
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
