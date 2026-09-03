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
import { resendOtpDelaySeconds } from "@/constants/time";

export default function useRegisterPageVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const registerVerifyMutation = useRegisterVerifyMutation();
  const resendOtpMutation = useResendOtpMutation();
  const { data, error, isError, isLoading } = useRegisterVerifyQuery(
    email ?? "",
  );

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

  const [resendOtpDelay, setResendOtpDelay] = useState<number>(
    resendOtpDelaySeconds,
  );

  const isLoadingSubmit = isSubmitting || registerVerifyMutation.isPending;

  const getResendSeconds = (otpValidResendTime: string): number => {
    const targetTime = new Date(otpValidResendTime).getTime();
    const now = Date.now();

    const resendSeconds = Math.max(0, Math.ceil((targetTime - now) / 1000));

    return resendSeconds;
  };

  const onResendOtp = async () => {
    const toastId = toast.loading("Resending OTP...");
    try {
      const values = getValues();

      const response = await resendOtpMutation.mutateAsync({
        email: values.email,
      });

      if (response?.otpValidResendTime) {
        setResendOtpDelay(getResendSeconds(response.otpValidResendTime));
      } else {
        setResendOtpDelay(resendOtpDelaySeconds);
      }

      toast.success("Berhasil Resend OTP");
    } catch (error: any) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    const toastId = toast.loading("Verifying OTP...");
    try {
      await registerVerifyMutation.mutateAsync({
        email: values.email,
        code: values.code,
      });

      toast.success("Akun berhasil diverifikasi, silakan login");
      navigate(paths.login);
    } catch (error: any) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (!data?.user || !data?.otpValidResendTime) return;

    if (data.user.status !== userStatus.PENDING_EMAIL) {
      navigate(paths.login);
    } else {
      setResendOtpDelay(getResendSeconds(data.otpValidResendTime));
    }
  }, [data]);

  useEffect(() => {
    if (isError && error) {
      apiErrorHandler(error);
      navigate(paths.login);
    }
  }, [isError, error]);

  return {
    control,
    errors,
    isLoading,
    isLoadingSubmit,
    resendOtpDelay,
    handleSubmit,
    onResendOtp,
    onSubmit,
  };
}
