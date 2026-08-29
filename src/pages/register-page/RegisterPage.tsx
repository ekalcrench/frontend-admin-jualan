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
import useRegisterPage from "./RegisterPage.hooks";
import { RegisterPageContainer } from "./RegisterPage.styles";
import { TypographyCenter } from "@/styled/CustomTypography";
import { Link } from "react-router-dom";
import { paths } from "@/constants/path";

export default function RegisterPage() {
  const {
    control,
    errors,
    isSubmitting,
    showPassword,
    showPasswordConfirmation,
    handleSubmit,
    onSubmit,
    setShowPassword,
    setShowPasswordConfirmation,
  } = useRegisterPage();

  return (
    <RegisterPageContainer>
      <Card elevation={2} sx={{ width: "440px", maxWidth: "90vw" }}>
        <CardContent>
          <TypographyCenter variant="h4">Register</TypographyCenter>
          <TypographyCenter sx={{ marginBottom: "32px", marginTop: "12px" }}>
            Isi formulir registrasi agar dapat masuk ke halaman dashboard
          </TypographyCenter>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              name="name"
              control={control}
              errors={errors}
              label="Name"
              placeholder="John Doe"
              renderErrorMessage
            />

            <CustomInput
              name="email"
              control={control}
              errors={errors}
              label="Email"
              placeholder="contoh@gmail.com"
              renderErrorMessage
            />

            <CustomInput
              name="password"
              control={control}
              errors={errors}
              label="Password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              renderErrorMessage
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

            <CustomInput
              name="passwordConfirmation"
              control={control}
              errors={errors}
              label="Password Confirmation"
              placeholder="••••••••"
              type={showPasswordConfirmation ? "text" : "password"}
              renderErrorMessage
              textFieldProps={{
                slotProps: {
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowPasswordConfirmation(
                              (prevState) => !prevState,
                            )
                          }
                        >
                          {showPasswordConfirmation ? (
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
    </RegisterPageContainer>
  );
}
