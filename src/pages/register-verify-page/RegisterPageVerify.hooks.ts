import useAuthStore from "@/store/auth-store";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RegisterFormValues } from "./RegisterPageVerify.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerVerifySchema } from "./RegisterPageVerify.contants";
import { useEffect, useState } from "react";
import {
  useRegisterVerifyMutation,
  useRegisterVerifyQuery,
  useResendOtpMutation,
} from "@/services/auth";
import { toast } from "sonner";
import { paths } from "@/constants/path";
import { userStatus } from "@/constants/user";
import { apiErrorHandler } from "@/utils/api";

export default function useRegisterPageVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const registerVerifyMutation = useRegisterVerifyMutation();
  const resendOtpMutation = useResendOtpMutation();
  const { data, isError } = useRegisterVerifyQuery(email ?? "");

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerVerifySchema),
    mode: "onBlur",
    defaultValues: {
      code: "",
      email: email ?? "",
    },
  });

  // Use combined loading state: form submitting OR mutation pending
  const isLoading = isSubmitting || registerVerifyMutation.isPending;

  const onResendOtp = async () => {
    try {
      const values = getValues();

      const response = await resendOtpMutation.mutateAsync({
        email: values.email,
      });

      console.log(">>> response di onResendOtp: ", response);

      toast.success("Berhasil Resend OTP");
    } catch (error: any) {
      apiErrorHandler(error);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    console.log(">>> values : ", values);
    try {
      const response = await registerVerifyMutation.mutateAsync({
        email: values.email,
        code: values.code,
      });

      console.log(">>> response di onSubmit: ", response);

      toast.success("Account created successfully!");
      navigate(paths.login);
    } catch (error: any) {
      apiErrorHandler(error);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    console.log(">>> data : ", data);
    if (!data) return;

    // if (data.status !== userStatus.PENDING_EMAIL) {
    //   navigate(paths.login);
    // }
  }, [data]);

  useEffect(() => {
    if (isError) navigate(paths.login);
  }, [isError]);

  return {
    control,
    errors,
    isSubmitting: isLoading,
    handleSubmit,
    onResendOtp,
    onSubmit,
  };
}
