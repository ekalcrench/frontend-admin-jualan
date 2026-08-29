import { Box, BoxProps, styled } from "@mui/material";

export const RegisterPageContainer = styled(Box)<BoxProps>(
  ({ theme: { palette } }) => ({
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    backgroundColor: palette.background.default,
  }),
);
