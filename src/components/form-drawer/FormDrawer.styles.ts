import { styled, SwipeableDrawer, SwipeableDrawerProps } from "@mui/material";

export const CustomFormDrawer = styled(SwipeableDrawer)<SwipeableDrawerProps>(
  ({ theme: { palette } }) => ({
    "& .MuiDrawer-paper": {
      width: "440px",
      backgroundColor: palette.background.default,
      padding: "24px",
      boxShadow: "none",
      border: "none",
      color: palette.text.primary,
    },
  }),
);
