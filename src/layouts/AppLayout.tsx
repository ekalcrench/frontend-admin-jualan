import ModalConfirmation from "@/components/modal-confirmation";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import { Toaster } from "sonner";

export default function AppLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const confirmation = useConfirmationStore();

  return (
    <>
      <Toaster />
      <ModalConfirmation
        isOpen={confirmation.isOpen}
        message={confirmation.message}
        title={confirmation.title}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        dialogProps={confirmation.dialogProps}
        onCancel={() => confirmation.close(false)}
        onConfirm={() => confirmation.close(true)}
      />
      {children}
    </>
  );
}
