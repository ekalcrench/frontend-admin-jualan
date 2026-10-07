import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import CustomTable from "@/components/custom-table";
import { BoxFlex } from "@/styled/CustomBox";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import PurchaseForm from "./components/purchase-form";
import usePurchasesPage from "./PurchasesPage.hooks";
import type { MRT_Row } from "material-react-table";

interface PurchaseRow {
  id: string;
  supplierName?: string;
  invoiceNumber?: string;
  purchasedAt?: string;
  purchaseItems?: unknown[];
  totalCost?: number;
  totalAmount?: number;
}

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

  const renderRowActions = (row: MRT_Row<PurchaseRow>) => (
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
              Mengelola pembelian barang persediaan
            </Typography>
          </Box>
        </Box>

        <CustomTable<PurchaseRow>
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
            columnVisibility: { id: false },
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
          searchPlaceholder="Cari berdasarkan pemasok atau nomor faktur"
        />
      </Stack>
    </Box>
  );
}
