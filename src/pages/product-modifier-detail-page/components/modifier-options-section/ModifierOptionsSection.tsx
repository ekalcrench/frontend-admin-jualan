import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ModifierEmptyState from "@/components/product-modifier/modifier-empty-state";
import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { currencyFormatter } from "@/utils/currency";
import { formatInventoryDeduction } from "@/utils/productModifier";
import type { ModifierOptionsSectionProps } from "./ModifierOptionsSection.types";

export default function ModifierOptionsSection({
  options,
  canManage,
  isReorderPending,
  statusPendingId,
  deletePendingId,
  onAdd,
  onEdit,
  onToggleActive,
  onDelete,
  onMove,
}: ModifierOptionsSectionProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const renderHeader = () => (
    <BoxFlexSpaceBetween
      sx={{
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: "12px",
      }}
    >
      <Box>
        <Typography variant="h6">Opsi Variasi</Typography>
        <Typography variant="body2" color="text.secondary">
          Daftar pilihan yang dapat dipilih pelanggan dari grup ini.
        </Typography>
      </Box>

      {canManage && (
        <Button
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}
        >
          Tambah Opsi
        </Button>
      )}
    </BoxFlexSpaceBetween>
  );

  const renderEmpty = () => (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: "12px",
        backgroundColor: "background.paper",
        marginTop: "16px",
      }}
    >
      <ModifierEmptyState
        icon={<PlaylistAddRoundedIcon />}
        title="Belum ada opsi variasi"
        description="Tambahkan opsi seperti isian ekstra atau tingkat kematangan beserta harga tambahannya."
        minHeight={180}
        action={
          canManage ? (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onAdd}
            >
              Tambah Opsi
            </Button>
          ) : undefined
        }
      />
    </Box>
  );

  const isStatusPending = (optionId: string) => statusPendingId === optionId;
  const isDeletePending = (optionId: string) => deletePendingId === optionId;

  const renderInventoryInfo = (
    option: ModifierOptionsSectionProps["options"][number],
  ) => {
    const inventoryLabel = formatInventoryDeduction(
      option.inventoryItem,
      option.inventoryQuantity,
    );

    return (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          marginTop: "4px",
          ...(!inventoryLabel && { fontStyle: "italic", opacity: 0.8 }),
        }}
      >
        {inventoryLabel
          ? `Persediaan: ${inventoryLabel}`
          : "Tanpa pengurangan persediaan"}
      </Typography>
    );
  };

  const renderTable = () => (
    <TableContainer
      sx={{
        marginTop: "16px",
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: "12px",
        backgroundColor: "background.paper",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nama Opsi</TableCell>
            <TableCell>Harga Tambahan</TableCell>
            <TableCell width={110}>Status</TableCell>
            <TableCell width={110}>Urutan</TableCell>
            <TableCell width={120} align="right">
              Aksi
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {options.map((option, index) => (
            <TableRow key={option.id} hover>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{option.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description || "Tanpa deskripsi"}
                </Typography>
                {renderInventoryInfo(option)}
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 500 }}>
                  {currencyFormatter.format(option.price)}
                </Typography>
              </TableCell>
              <TableCell>
                <Switch
                  size="small"
                  checked={option.isActive}
                  disabled={!canManage || isStatusPending(option.id)}
                  onChange={() => onToggleActive(option)}
                  slotProps={{
                    input: {
                      "aria-label": `Aktifkan opsi ${option.name}`,
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <BoxFlex sx={{ gap: "2px" }}>
                  <Typography variant="body2" sx={{ minWidth: "16px" }}>
                    {index + 1}
                  </Typography>
                  {canManage && (
                    <>
                      <IconButton
                        size="small"
                        aria-label={`Naikkan opsi ${option.name}`}
                        disabled={index === 0 || isReorderPending}
                        onClick={() => onMove(index, -1)}
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={`Turunkan opsi ${option.name}`}
                        disabled={
                          index === options.length - 1 || isReorderPending
                        }
                        onClick={() => onMove(index, 1)}
                      >
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </BoxFlex>
              </TableCell>
              <TableCell align="right">
                {canManage && (
                  <BoxFlex sx={{ gap: "2px", justifyContent: "flex-end" }}>
                    <Tooltip title="Edit opsi">
                      <IconButton
                        aria-label={`Edit opsi ${option.name}`}
                        onClick={() => onEdit(option)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Hapus opsi">
                      <IconButton
                        aria-label={`Hapus opsi ${option.name}`}
                        color="error"
                        loading={isDeletePending(option.id)}
                        onClick={() => onDelete(option)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </BoxFlex>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCards = () => (
    <Stack spacing={1.5} sx={{ marginTop: "16px" }}>
      {options.map((option, index) => (
        <Box
          key={option.id}
          sx={{
            border: "1px solid",
            borderColor: "border.main",
            borderRadius: "12px",
            backgroundColor: "background.paper",
            padding: "16px",
          }}
        >
          <BoxFlexSpaceBetween sx={{ alignItems: "flex-start", gap: "8px" }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600 }}>{option.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {option.description || "Tanpa deskripsi"}
              </Typography>
              {renderInventoryInfo(option)}
            </Box>
            <Switch
              size="small"
              checked={option.isActive}
              disabled={!canManage || isStatusPending(option.id)}
              onChange={() => onToggleActive(option)}
              slotProps={{
                input: {
                  "aria-label": `Aktifkan opsi ${option.name}`,
                },
              }}
            />
          </BoxFlexSpaceBetween>

          <BoxFlexSpaceBetween sx={{ marginTop: "12px" }}>
            <Typography sx={{ fontWeight: 600 }}>
              {currencyFormatter.format(option.price)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Urutan {index + 1}
            </Typography>
          </BoxFlexSpaceBetween>

          {canManage && (
            <BoxFlex
              sx={{ justifyContent: "flex-end", gap: "4px", marginTop: "8px" }}
            >
              <IconButton
                size="small"
                aria-label={`Naikkan opsi ${option.name}`}
                disabled={index === 0 || isReorderPending}
                onClick={() => onMove(index, -1)}
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label={`Turunkan opsi ${option.name}`}
                disabled={index === options.length - 1 || isReorderPending}
                onClick={() => onMove(index, 1)}
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label={`Edit opsi ${option.name}`}
                onClick={() => onEdit(option)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label={`Hapus opsi ${option.name}`}
                color="error"
                loading={isDeletePending(option.id)}
                onClick={() => onDelete(option)}
              >
                <DeleteIcon />
              </IconButton>
            </BoxFlex>
          )}
        </Box>
      ))}
    </Stack>
  );

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
      {renderHeader()}
      {options.length === 0
        ? renderEmpty()
        : isMobile
          ? renderCards()
          : renderTable()}
    </Box>
  );
}
