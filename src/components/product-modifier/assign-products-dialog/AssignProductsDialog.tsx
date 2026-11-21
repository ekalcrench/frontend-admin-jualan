import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { BoxCenter, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { currencyFormatter } from "@/utils/currency";
import useAssignProductsDialog from "./AssignProductsDialog.hooks";
import type { AssignProductsDialogProps } from "./AssignProductsDialog.types";

export default function AssignProductsDialog(props: AssignProductsDialogProps) {
  const {
    assignedSet,
    filteredProducts,
    hasChanges,
    isLoading,
    isError,
    isSaving,
    refetch,
    search,
    selectedIds,
    selectedSet,
    setSearch,
    handleToggleProduct,
    handleSubmit,
  } = useAssignProductsDialog(props);

  return (
    <Dialog
      open={props.open}
      onClose={isSaving ? undefined : props.onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: "16px" },
        },
      }}
    >
      <DialogTitle sx={{ paddingBottom: "8px" }}>
        Atur Produk untuk Grup Ini
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          Pilih produk yang dapat menggunakan grup variasi{" "}
          <strong>{props.groupName}</strong>. Produk yang sudah tercentang
          berarti sudah menggunakan grup ini.
        </Typography>

        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari produk berdasarkan nama"
          size="small"
          variant="outlined"
          fullWidth
          disabled={isSaving}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            marginTop: "16px",
            marginBottom: "12px",
            "& input": { height: "48px" },
          }}
        />

        <Box
          sx={{
            border: "1px solid",
            borderColor: "border.main",
            borderRadius: "12px",
            maxHeight: 360,
            overflowY: "auto",
            backgroundColor: "background.paper",
          }}
        >
          {isLoading ? (
            <BoxCenter sx={{ paddingY: "40px" }}>
              <CircularProgress size={28} />
            </BoxCenter>
          ) : isError ? (
            <BoxCenter
              sx={{
                padding: "32px 24px",
                flexDirection: "column",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Gagal memuat daftar produk.
              </Typography>
              <Button size="small" variant="outlined" onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </BoxCenter>
          ) : filteredProducts.length === 0 ? (
            <BoxCenter sx={{ padding: "32px 24px" }}>
              <Typography variant="body2" color="text.secondary">
                {search.trim()
                  ? "Produk tidak ditemukan."
                  : "Belum ada produk di organisasi ini."}
              </Typography>
            </BoxCenter>
          ) : (
            <List disablePadding>
              {filteredProducts.map((product) => {
                const isSelected = selectedSet.has(product.id);
                const wasAssigned = assignedSet.has(product.id);

                return (
                  <ListItemButton
                    key={product.id}
                    onClick={() => handleToggleProduct(product.id)}
                    disabled={isSaving}
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "border.main",
                      "&:last-of-type": { borderBottom: "none" },
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      edge="start"
                      disableRipple
                      tabIndex={-1}
                      sx={{ marginRight: "8px" }}
                    />
                    <ListItemText
                      sx={{ color: "text.primary" }}
                      primary={product.name}
                      secondary={`${currencyFormatter.format(product.sellingPrice)}${
                        wasAssigned ? " · Sudah menggunakan grup ini" : ""
                      }`}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Box>

        <BoxFlexSpaceBetween sx={{ marginTop: "12px" }}>
          <Typography variant="body2" color="text.secondary">
            {selectedIds.length} produk dipilih
          </Typography>
        </BoxFlexSpaceBetween>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button onClick={props.onClose} disabled={isSaving} variant="text">
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isSaving}
          disabled={!hasChanges}
          variant="contained"
        >
          Simpan Penugasan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
