import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ModifierEmptyState from "@/components/product-modifier/modifier-empty-state";
import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { currencyFormatter } from "@/utils/currency";
import type { AssignedProductsSectionProps } from "./AssignedProductsSection.types";

export default function AssignedProductsSection({
  products,
  canManage,
  removingProductId,
  onOpenAssign,
  onRemove,
}: AssignedProductsSectionProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: "16px",
        backgroundColor: "background.paper",
        padding: { xs: "16px", sm: "24px" },
      }}
    >
      <BoxFlexSpaceBetween
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: "12px",
        }}
      >
        <Box>
          <Typography variant="h6">Produk yang menggunakan grup ini</Typography>
          <Typography variant="body2" color="text.secondary">
            Produk-produk ini menampilkan grup variasi saat pelanggan memesan.
          </Typography>
        </Box>

        {canManage && (
          <Button
            startIcon={<PlaylistAddRoundedIcon />}
            onClick={onOpenAssign}
            sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}
          >
            Atur Produk
          </Button>
        )}
      </BoxFlexSpaceBetween>

      {products.length === 0 ? (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "border.main",
            borderRadius: "12px",
            marginTop: "16px",
          }}
        >
          <ModifierEmptyState
            icon={<PlaylistAddRoundedIcon />}
            title="Belum ada produk yang menggunakan grup ini"
            description="Atur produk agar grup variasi ini muncul saat pelanggan memesan produk tersebut."
            minHeight={180}
            action={
              canManage ? (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlaylistAddRoundedIcon />}
                  onClick={onOpenAssign}
                >
                  Atur Produk
                </Button>
              ) : undefined
            }
          />
        </Box>
      ) : (
        <Stack
          divider={<Divider flexItem />}
          sx={{
            marginTop: "16px",
            border: "1px solid",
            borderColor: "border.main",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {products.map((product) => (
            <BoxFlexSpaceBetween
              key={product.id}
              sx={{
                padding: "14px 16px",
                gap: "12px",
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currencyFormatter.format(product.sellingPrice)}
                </Typography>
              </Box>

              {canManage && (
                <Tooltip title="Hapus penugasan produk">
                  <IconButton
                    aria-label={`Hapus penugasan ${product.name}`}
                    color="error"
                    loading={removingProductId === product.id}
                    onClick={() => onRemove(product)}
                  >
                    <LinkOffRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </BoxFlexSpaceBetween>
          ))}
        </Stack>
      )}
    </Box>
  );
}
