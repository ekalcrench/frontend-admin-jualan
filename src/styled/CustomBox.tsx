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
