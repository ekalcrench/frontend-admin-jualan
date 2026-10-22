import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import CustomTable from "@/components/custom-table";
import { defaultParameter } from "@/constants/table";
import { isEditableCashTransactionType } from "@/constants/cashTransaction";
import { CashTransactionResponse } from "@/types/cashTransaction";
import { MRT_Row } from "material-react-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import CashTransactionForm from "./components/cash-transaction-form";
import useCashFlowsPage from "./CashFlowsPage.hooks";
import CashDetails from "./components/cash-details";
import ReportDate from "./components/report-date";

export default function CashFlowsPage() {
  const {
    columns,
    data,
    deleteCashTransaction,
    editingCashTransactionId,
    isFormOpen,
    isLoading,
    isError,
    search,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleResetFilter,
    setIsFormOpen,
  } = useCashFlowsPage();

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Arus Kas
    </Button>
  );

  const renderRowActions = (row: MRT_Row<CashTransactionResponse>) => {
    if (!isEditableCashTransactionType(row.original.type)) return null;

    return (
      <Stack direction="row">
        <IconButton
          aria-label={`Edit cash flow ${row.original.id}`}
          onClick={() => handleClickEditForm(row.original.id)}
          color="secondary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label={`Delete cash flow ${row.original.id}`}
          onClick={() => handleClickDelete(row.original)}
          color="error"
          loading={
            deleteCashTransaction.isPending &&
            deleteCashTransaction.variables === row.original.id
          }
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    );
  };

  return (
    <Box>
      <CashTransactionForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        id={editingCashTransactionId}
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
            <Typography variant="h5">Cash Flows</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengelola arus kas investasi dan bagi hasil
            </Typography>
          </Box>
        </Box>

        <ReportDate />

        <CashDetails />

        <CustomTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          page={data?.pagination?.page ?? defaultParameter.page}
          size={data?.pagination?.size ?? defaultParameter.size}
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
          columnRowActionsSize={100}
          renderRowActions={({ row }) => renderRowActions(row)}
          searchPlaceholder="Cari berdasarkan deskripsi atau jenis transaksi"
        />
      </Stack>
    </Box>
  );
}
