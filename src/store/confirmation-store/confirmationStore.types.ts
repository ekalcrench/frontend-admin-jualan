import { ModalConfirmationProps } from "@/components/modal-confirmation/ModalConfirmation.types";

export interface ConfirmationState extends ModalConfirmationProps {
  confirm(options: Omit<ModalConfirmationProps, "isOpen">): Promise<boolean>;
  close(confirmed: boolean): void;
}
