import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import type { ProductModifierGroupResponse } from "@/types/productModifier";
import { numberFormat } from "@/utils/number";
import {
  formatSelectionMode,
  formatSelectionRule,
} from "@/utils/productModifier";
import type { ModifierGroupCardProps } from "./ModifierGroupCard.types";

export default function ModifierGroupCard({
  group,
  canManage,
  isToggling,
  isDeleting,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: ModifierGroupCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <BoxFlexSpaceBetween
          sx={{ alignItems: "flex-start", gap: "12px" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600 }}>{group.name}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                marginTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {group.description || "Tanpa deskripsi"}
            </Typography>
          </Box>

          <Chip
            label={group.isActive ? "Aktif" : "Nonaktif"}
            size="small"
            color={group.isActive ? "success" : "default"}
            variant={group.isActive ? "filled" : "outlined"}
            sx={{ flexShrink: 0 }}
          />
        </BoxFlexSpaceBetween>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{ flexWrap: "wrap", gap: "6px", marginTop: "12px" }}
        >
          <Chip
            label={`${numberFormat.format(group.optionsCount)} opsi`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${numberFormat.format(group.assignedProductsCount)} produk`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={formatSelectionMode(group.isRequired)}
            size="small"
            variant="outlined"
            color={group.isRequired ? "primary" : "default"}
          />
          <Chip
            label={formatSelectionRule(group)}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ marginY: "12px" }} />

        <BoxFlexSpaceBetween sx={{ gap: "8px", flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="text"
            startIcon={<VisibilityIcon />}
            onClick={() => onView(group)}
          >
            Lihat Detail
          </Button>

          {canManage && (
            <BoxFlex sx={{ gap: "2px", flexWrap: "wrap" }}>
              <Tooltip title="Edit grup">
                <IconButton
                  aria-label={`Edit ${group.name}`}
                  onClick={() => onEdit(group)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={group.isActive ? "Nonaktifkan grup" : "Aktifkan grup"}
              >
                <IconButton
                  aria-label={
                    group.isActive
                      ? `Nonaktifkan ${group.name}`
                      : `Aktifkan ${group.name}`
                  }
                  color={group.isActive ? "warning" : "success"}
                  loading={isToggling}
                  onClick={() => onToggleActive(group)}
                >
                  {group.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Hapus grup">
                <IconButton
                  aria-label={`Hapus ${group.name}`}
                  color="error"
                  loading={isDeleting}
                  onClick={() => onDelete(group)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </BoxFlex>
          )}
        </BoxFlexSpaceBetween>
      </CardContent>
    </Card>
  );
}
