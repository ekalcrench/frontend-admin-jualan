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
import useLoginPage from "./LoginPage.hooks";
import { LoginPageContainer } from "./LoginPage.styles";
import { TypographyCenter } from "@/styled/CustomTypography";
import { Link } from "react-router-dom";
import { paths } from "@/constants/path";

export default function LoginPage() {
  const {
    control,
    errors,
    isLoading,
    showPassword,
    handleSubmit,
    onSubmit,
    setShowPassword,
  } = useLoginPage();

  return (
    <LoginPageContainer>
      <Card elevation={2} sx={{ width: "440px", maxWidth: "90vw" }}>
        <CardContent>
          <TypographyCenter variant="h4">Admin Login</TypographyCenter>
          <TypographyCenter sx={{ marginBottom: "32px", marginTop: "12px" }}>
            Masuk ke dashboard untuk mengelola bisnis Anda dengan mudah
          </TypographyCenter>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              name="email"
              control={control}
              errors={errors}
              label="Email"
              placeholder="contoh@gmail.com"
              renderErrorMessage
              disabled={isLoading}
            />

            <CustomInput
              name="password"
              control={control}
              errors={errors}
              label="Password"
              placeholder="Masukkan password"
              type={showPassword ? "text" : "password"}
              renderErrorMessage
              disabled={isLoading}
              textFieldProps={{
                type: showPassword ? "text" : "password",
                slotProps: {
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                        >
                          {showPassword ? (
                            <VisibilityOff color="primary" />
                          ) : (
                            <Visibility color="primary" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />

            <Button
              sx={{ marginTop: "20px" }}
              type="submit"
              variant="contained"
              fullWidth
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <TypographyCenter sx={{ marginTop: "20px" }}>
            Tidak punya akun?{" "}
            <Link
              to={paths.register}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography component="span" sx={{ color: "secondary.main" }}>
                Daftar Sekarang
              </Typography>
            </Link>
          </TypographyCenter>
        </CardContent>
      </Card>
    </LoginPageContainer>
  );
}
