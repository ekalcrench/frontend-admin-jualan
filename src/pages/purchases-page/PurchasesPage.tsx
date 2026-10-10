import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomTable from "@/components/custom-table";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import PurchaseForm from "./components/purchase-form";
import usePurchasesPage from "./PurchasesPage.hooks";
import type { MRT_Row } from "material-react-table";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { currencyFormatter } from "@/constants/currency";
import { TypographyTab } from "@/styled/CustomTypography";
import { formatLocalDate } from "@/utils/dateTime";
import { PurchaseResponse } from "@/types/purchase";
import { StackDetailPanel } from "./PurchasesPage.styles";

export default function PurchasesPage() {
  const {
    columns,
    data,
    editingPurchaseId,
    isFormOpen,
    isLoading,
    isError,
    search,
    sortBy,
    deletePurchase,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleResetFilter,
    setIsFormOpen,
  } = usePurchasesPage();

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Pembelian
    </Button>
  );

  const renderRowActions = (row: MRT_Row<PurchaseResponse>) => (
    <BoxFlex>
      <IconButton
        aria-label={`Edit purchase ${row.original.invoiceNumber ?? row.original.id}`}
        onClick={() => handleClickEditForm(row.original.id)}
        color="secondary"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        aria-label={`Delete purchase ${row.original.invoiceNumber ?? row.original.id}`}
        onClick={() => handleClickDelete(row.original.id)}
        color="error"
        loading={
          deletePurchase.isPending &&
          deletePurchase.variables === row.original.id
        }
      >
        <DeleteIcon />
      </IconButton>
    </BoxFlex>
  );

  const renderDetailPanel = (row: MRT_Row<PurchaseResponse>) => (
    <StackDetailPanel spacing={2}>
      <Typography>Purchase #{row.original.invoiceNumber}</Typography>

      <Box>
        <TypographyTab>{`Supplier\t: ${row.original.supplierName}`}</TypographyTab>
        <TypographyTab>{`Tanggal\t: ${formatLocalDate(row.original.purchasedAt)}`}</TypographyTab>
      </Box>

      <Box>
        <Typography>Items</Typography>
        <Divider sx={{ marginTop: "4px", marginBottom: "8px" }} />
        <Grid container columnSpacing={2}>
          {row.original.purchaseItems.map((item) => (
            <>
              <Grid size={6}>
                <Typography>{item.inventoryItem.name}</Typography>
              </Grid>
              <Grid size={3}>
                <Typography>
                  {`${item.quantity} ${inventoryUnitLabels[item.inventoryItem.unit]}`}
                </Typography>
              </Grid>
              <Grid size={3}>
                <BoxFlexEnd>
                  <Typography>
                    {currencyFormatter.format(item.totalCost)}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
            </>
          ))}
        </Grid>
        <Divider sx={{ marginTop: "8px", marginBottom: "4px" }} />
        <BoxFlexSpaceBetween>
          <Typography sx={{ fontWeight: 700 }}>Total</Typography>
          <Typography>
            {currencyFormatter.format(
              row.original.purchaseItems.reduce(
                (total, item) => total + Number(item.totalCost),
                0,
              ),
            )}
          </Typography>
        </BoxFlexSpaceBetween>
      </Box>
    </StackDetailPanel>
  );

  return (
    <Box>
      <PurchaseForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        id={editingPurchaseId}
      />

      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: "16px",
            padding: "16px 12px",
          }}
        >
          <Box>
            <Typography variant="h5">Purchases</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengelola pembelian stok inventory
            </Typography>
          </Box>
        </Box>

        <CustomTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          page={data?.pagination?.page}
          size={data?.pagination?.size}
          totalRows={data?.pagination?.total}
          totalPages={data?.pagination?.totalPages}
          handleChangePage={handleChangePage}
          initialState={{
            columnVisibility: { id: false, createdAt: false, updatedAt: false },
          }}
          sortBy={{
            direction: getSortDirection(sortBy),
            id: removeSortByDirection(sortBy),
          }}
          onSortChange={handleChangeSort}
          handleResetFilter={handleResetFilter}
          search={search}
          handleSearch={handleChangeSearch}
          addButton={renderAddButton()}
          enableRowActions
          columnRowActionsSize={96}
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan supplier atau nomor invoice"
        />
      </Stack>
    </Box>
  );
}
