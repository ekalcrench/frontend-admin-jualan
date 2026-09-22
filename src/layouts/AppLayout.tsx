import { Component, Suspense, type ErrorInfo, type ReactNode } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import { Box, Button, Typography } from "@mui/material";
import ModalConfirmation from "@/components/modal-confirmation";
import LoadingPage from "@/components/loading-page";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import { Toaster } from "sonner";

type AppLayoutErrorBoundaryState = {
  hasError: boolean;
};

class AppLayoutErrorBoundary extends Component<
  { children: ReactNode },
  AppLayoutErrorBoundaryState
> {
  state: AppLayoutErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppLayoutErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AppLayout failed to render", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <AppLayoutErrorFallback />;
    }

    return this.props.children;
  }
}

function AppLayoutErrorFallback() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        textAlign: "center",
        padding: 3,
      }}
    >
      <WarningIcon color="error" sx={{ fontSize: 64 }} />
      <Typography variant="h5">Terjadi kesalahan</Typography>
      <Typography color="text.secondary">
        Halaman gagal dimuat. Silakan muat ulang dan coba lagi.
      </Typography>
      <Button
        startIcon={<WarningIcon />}
        onClick={() => window.location.reload()}
      >
        Muat ulang halaman
      </Button>
    </Box>
  );
}

function AppLayoutContent({ children }: { children?: React.ReactNode }) {
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

export default function AppLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <AppLayoutErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <AppLayoutContent>{children}</AppLayoutContent>
      </Suspense>
    </AppLayoutErrorBoundary>
  );
}
