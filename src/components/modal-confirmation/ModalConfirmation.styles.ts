import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { BoxCenter } from "@/styled/CustomBox";
import { borderRadiusCard, boxShadowDialog } from "@/constants/styled";

export const DialogPaperComponent = styled(Paper)(() => ({
  padding: "16px 20px",
  background: "#ffffff",
  boxShadow: boxShadowDialog,
  borderRadius: borderRadiusCard,
  width: "320px",
  minHeight: "300px",
  height: "auto",
  zIndex: 999999999,
  boxSizing: "border-box",
}));

export const TitleDialog = styled(DialogTitle)(() => ({
  padding: 0,
}));

export const IconWrapperBox = styled(BoxCenter)(() => ({
  marginBottom: "8px",
  marginTop: "24px",
}));

export const ContentDialogText = styled(Typography)(() => ({
  fontSize: "16px",
  textAlign: "center",
}));

export const ActionsDialogWarning = styled(BoxCenter)(() => ({
  padding: 0,
  marginTop: "32px",
}));
