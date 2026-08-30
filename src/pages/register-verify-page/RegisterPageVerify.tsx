import {
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CustomInput } from "@/components/custom-input";
import useRegisterPageVerify from "./RegisterPageVerify.hooks";
import { RegisterPageVerifyContainer } from "./RegisterPageVerify.styles";
import { TypographyCenter } from "@/styled/CustomTypography";
import { Link } from "react-router-dom";
import { paths } from "@/constants/path";
import { CustomOtp } from "@/components/custom-otp";
import { ResendOtpTimer } from "./components/resend-otp-timer";

export default function RegisterPageVerify() {
  const { control, errors, isSubmitting, handleSubmit, onResendOtp, onSubmit } =
    useRegisterPageVerify();

  return (
    <RegisterPageVerifyContainer>
      <Card elevation={2} sx={{ width: "440px", maxWidth: "90vw" }}>
        <CardContent>
          <TypographyCenter variant="h4">Verifikasi OTP</TypographyCenter>
          <TypographyCenter sx={{ marginBottom: "32px", marginTop: "12px" }}>
            Cek email Anda untuk mengetahui Kode OTP dan melanjutkan pendaftaran
          </TypographyCenter>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              name="email"
              control={control}
              errors={errors}
              label="Email"
              placeholder="contoh@gmail.com"
              renderErrorMessage
              disabled
            />

            <CustomOtp name="code" control={control} label="Kode OTP" />

            <ResendOtpTimer delaySeconds={5} onResend={onResendOtp} />

            <Button
              sx={{ marginTop: "24px" }}
              type="submit"
              variant="contained"
              fullWidth
              // disabled={isSubmitting}
            >
              Register
            </Button>
          </form>

          <TypographyCenter sx={{ marginTop: "20px" }}>
            Sudah punya akun?{" "}
            <Link
              to={paths.login}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography component="span" sx={{ color: "secondary.main" }}>
                Log in
              </Typography>
            </Link>
          </TypographyCenter>
        </CardContent>
      </Card>
    </RegisterPageVerifyContainer>
  );
}
