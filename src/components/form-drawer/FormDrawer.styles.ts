import { styled, SwipeableDrawer, SwipeableDrawerProps } from "@mui/material";

export const CustomFormDrawer = styled(SwipeableDrawer)<SwipeableDrawerProps>(
  ({ theme: { palette, breakpoints } }) => ({
    "& .MuiDrawer-paper": {
      width: "440px",
      maxWidth: "100%",
      backgroundColor: palette.background.default,
      padding: "24px",
      boxShadow: "none",
      border: "none",
      color: palette.text.primary,
      [breakpoints.down(600)]: {
        width: "100%",
        padding: "20px 16px",
      },
    },
  }),
);
