import { styled } from "@mui/material";

export const CustomMain = styled("main")(({ theme: { breakpoints } }) => ({
  padding: "32px 24px",
  boxSizing: "border-box",
  flex: "1 1 0",
  minWidth: 0,
  minHeight: 0,
  maxWidth: "100%",
  overflow: "auto",
  [breakpoints.down(600)]: {
    padding: "32px 16px",
  },
}));
