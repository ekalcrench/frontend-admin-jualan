import { styled, Typography, TypographyProps } from "@mui/material";

export const TypographyCenter = styled(Typography)<TypographyProps>(() => ({
  textAlign: "center",
}));

export const TypographyInputLabel = styled(Typography)<TypographyProps>(() => ({
  marginBottom: "8px",
}));

export const TypographyErrorInput = styled(Typography)<TypographyProps>(() => ({
  position: "absolute",
  bottom: 0,
  marginLeft: "16px",
  fontSize: "12px",
}));

export const TypographyTab = styled(Typography)<TypographyProps>(() => ({
  whiteSpace: "pre",
}));
