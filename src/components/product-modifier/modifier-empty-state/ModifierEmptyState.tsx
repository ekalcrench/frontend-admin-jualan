import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface ModifierEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  minHeight?: number;
}

export default function ModifierEmptyState({
  title,
  description,
  icon,
  action,
  minHeight = 220,
}: ModifierEmptyStateProps) {
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
        minHeight,
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
        {icon ?? <TuneRoundedIcon />}
      </Box>

      <Typography sx={{ fontWeight: 600 }}>{title}</Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360 }}
        >
          {description}
        </Typography>
      )}

      {action && <Box sx={{ marginTop: "8px" }}>{action}</Box>}
    </Box>
  );
}
