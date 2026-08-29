import { Button, Card, CardContent } from "@mui/material";
import { CustomInput } from "@/components/custom-input";
import useLoginPage from "./LoginPage.hooks";
import { LoginPageContainer } from "./LoginPage.styles";
import { TypographyCenter } from "@/styled/CustomTypography";

export default function LoginPage() {
  const { control, errors, isSubmitting, handleSubmit, onSubmit } =
    useLoginPage();

  return (
    <LoginPageContainer>
      <Card elevation={2} sx={{ width: "440px", maxWidth: "90vw" }}>
        <CardContent>
          <TypographyCenter variant="h5">Admin Login</TypographyCenter>
          <TypographyCenter sx={{ marginBottom: "24px", marginTop: "8px" }}>
            Masuk ke dashboard untuk mengelola bisnis Anda dengan mudah
          </TypographyCenter>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              name="email"
              control={control}
              errors={errors}
              label="Email"
              placeholder="you@example.com"
              // type="email"
              renderErrorMessage
            />

            <CustomInput
              name="password"
              control={control}
              errors={errors}
              label="Password"
              placeholder="Enter your password"
              type="password"
              renderErrorMessage
            />

            <Button
              sx={{ marginTop: "20px" }}
              type="submit"
              variant="contained"
              fullWidth
              // disabled={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </LoginPageContainer>
  );
}
