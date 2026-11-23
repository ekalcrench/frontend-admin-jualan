import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { Box, Button, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface CustomTableEmptyStatesOptions {
  itemName: string;
  search: string;
  onResetFilter: () => void;
  onRetry?: () => void;
  emptyAction?: ReactNode;
}

interface CustomTableEmptyStates {
  renderEmptyState: ReactNode;
  renderSearchEmptyContent: ReactNode;
  renderErrorState: ReactNode;
}

function CustomTableEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "8px",
        padding: "32px 24px",
        minHeight: 220,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "background.default",
          color: "text.secondary",
          marginBottom: "4px",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 360 }}
      >
        {description}
      </Typography>
      {action && <Box sx={{ marginTop: "8px" }}>{action}</Box>}
    </Box>
  );
}

export function createCustomTableEmptyStates({
  itemName,
  search,
  onResetFilter,
  onRetry,
  emptyAction,
}: CustomTableEmptyStatesOptions): CustomTableEmptyStates {
  const searchAction = (
    <Button variant="outlined" onClick={onResetFilter}>
      Reset Pencarian
    </Button>
  );

  return {
    renderEmptyState: (
      <CustomTableEmptyState
        icon={<InboxOutlinedIcon />}
        title={`Belum ada ${itemName}`}
        description={`Belum ada ${itemName} untuk ditampilkan.`}
        action={emptyAction}
      />
    ),
    renderSearchEmptyContent: (
      <CustomTableEmptyState
        icon={<SearchOffRoundedIcon />}
        title={`${itemName.charAt(0).toUpperCase()}${itemName.slice(1)} tidak ditemukan`}
        description={`Tidak ada ${itemName} yang cocok dengan pencarian "${search}".`}
        action={searchAction}
      />
    ),
    renderErrorState: (
      <CustomTableEmptyState
        icon={<ErrorOutlineRoundedIcon />}
        title={`Gagal memuat ${itemName}`}
        description="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
        action={
          onRetry ? (
            <Button variant="outlined" onClick={onRetry}>
              Coba Lagi
            </Button>
          ) : undefined
        }
      />
    ),
  };
}
