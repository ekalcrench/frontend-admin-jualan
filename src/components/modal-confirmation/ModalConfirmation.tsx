import { Dialog, Typography, Button } from "@mui/material";
import {
  TitleDialog,
  IconWrapperBox,
  ContentDialogText,
  ActionsDialogWarning,
  DialogPaperComponent,
} from "./ModalConfirmation.styles";
import { ModalConfirmationProps } from "./ModalConfirmation.types";
import { BoxCenter } from "@/styled/CustomBox";
import WarningIcon from "@mui/icons-material/Warning";

export default function ModalConfirmation({
  cancelText,
  confirmText,
  message,
  title,
  dialogProps,
  isOpen,
  onCancel,
  onConfirm,
}: ModalConfirmationProps) {
  return (
    <Dialog
      {...dialogProps}
      open={isOpen}
      PaperComponent={DialogPaperComponent}
      keepMounted
    >
      <TitleDialog>
        <Typography
          variant={"h6"}
          sx={{ textAlign: "center", fontWeight: 600 }}
        >
          {title ?? "Warning!"}
        </Typography>
      </TitleDialog>

      <IconWrapperBox>
        <WarningIcon sx={{ fontSize: "80px" }} color="warning" />
      </IconWrapperBox>

      <BoxCenter>
        <ContentDialogText>{message}</ContentDialogText>
      </BoxCenter>

      <ActionsDialogWarning>
        <Button onClick={onConfirm} sx={{ width: "6rem", marginRight: "1rem" }}>
          {confirmText ?? "Yes"}
        </Button>

        <Button onClick={onCancel} color="error" sx={{ width: "6rem" }}>
          {cancelText ?? "No"}
        </Button>
      </ActionsDialogWarning>
    </Dialog>
  );
}
