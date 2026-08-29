import { styled, Typography, TypographyProps } from "@mui/material";

export const TypographyCenter = styled(Typography)<TypographyProps>(() => ({
  textAlign: "center",
}));

export const TypographyInputLabel = styled(Typography)(() => ({
  marginBottom: "8px",
}));

export const TypographyErrorInput = styled(Typography)(() => ({
  position: "absolute",
  bottom: 0,
  marginLeft: "16px",
  fontSize: "12px",
}));
