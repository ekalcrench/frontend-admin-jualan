import { DialogProps } from "@mui/material/Dialog";

export interface ModalConfirmationProps {
  isOpen: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  dialogProps?: Omit<DialogProps, "open">;

  onCancel?(): void;
  onConfirm?(): void;
}
