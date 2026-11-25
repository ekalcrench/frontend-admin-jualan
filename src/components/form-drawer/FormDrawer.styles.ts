import { styled, SwipeableDrawer, SwipeableDrawerProps } from "@mui/material";
import { FormDrawerSize } from "./FormDrawer.types";

const drawerWidths: Record<FormDrawerSize, string> = {
  small: "440px",
  medium: "480px",
  large: "560px",
};

export const CustomFormDrawer = styled(SwipeableDrawer, {
  shouldForwardProp: (prop) => prop !== "size",
})<SwipeableDrawerProps & { size?: FormDrawerSize }>(
  ({ size = "small", theme: { palette, breakpoints } }) => ({
    "& .MuiDrawer-paper": {
      width: drawerWidths[size],
      maxWidth: "100%",
      backgroundColor: palette.background.default,
      padding: "24px 0px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "none",
      border: "none",
      color: palette.text.primary,
      [breakpoints.down(600)]: {
        width: "100%",
        padding: "16px 0px",
      },
    },
  }),
);
