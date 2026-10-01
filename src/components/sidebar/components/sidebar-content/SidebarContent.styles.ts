import {
  Box,
  BoxProps,
  styled,
  Typography,
  TypographyProps,
} from "@mui/material";

export const TopSidebar = styled(Box)<BoxProps>(({ theme: { palette } }) => ({
  display: "flex",
  alignItems: "center",
  padding: "16px 16px 8px 16px",
  gap: "8px",
  color: palette.text.sidebarActive,
}));

export const OrganizationName = styled(Typography)<TypographyProps>(
  ({ theme: { palette } }) => ({
    fontSize: "18px",
    fontWeight: 600,
  }),
);
