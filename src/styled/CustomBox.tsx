import { Box, BoxProps, styled } from "@mui/material";

export const BoxFieldWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== "renderErrorMessage",
})<BoxProps & { renderErrorMessage?: boolean }>(
  ({ renderErrorMessage, theme: { breakpoints } }) => ({
    position: "relative",
    ...(renderErrorMessage && {
      paddingBottom: "20px",

      [breakpoints.down(600)]: {
        paddingBottom: "16px",
      },
    }),
  }),
);

export const BoxCenter = styled(Box)<BoxProps>(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const BoxFlex = styled(Box)<BoxProps>(() => ({
  display: "flex",
  alignItems: "center",
}));

export const BoxFlexSpaceBetween = styled(Box)<BoxProps>(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
