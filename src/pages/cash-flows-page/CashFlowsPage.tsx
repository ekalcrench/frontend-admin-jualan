import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { defaultParameter } from "@/constants/table";
import { isEditableCashTransactionType } from "@/constants/cashTransaction";
import { CashTransactionResponse } from "@/types/cashTransaction";
import { MRT_Row } from "material-react-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import CashTransactionForm from "./components/cash-transaction-form";
import useCashFlowsPage from "./CashFlowsPage.hooks";
import CashDetails from "./components/cash-details";
import ReportDate from "@/components/report-date";
import PageTitle from "@/components/page-title";
import {
  cashTransactionTypeColorMapping,
  cashTransactionTypeLabels,
} from "@/constants/cashTransaction";
import { currencyFormatter } from "@/utils/currency";
import { formatLocalDate } from "@/utils/dateTime";
import { BoxFlexEnd } from "@/styled/CustomBox";

export default function CashFlowsPage() {
  const {
    columns,
    data,
    deleteCashTransaction,
    editingCashTransactionId,
    endDate,
    isFormOpen,
    isLoading,
    isError,
    refetch,
    search,
    sortBy,
    startDate,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleResetFilter,
    setEndDate,
    setIsFormOpen,
    setStartDate,
  } = useCashFlowsPage();
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "arus kas",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
  });

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Arus Kas
    </Button>
  );

  const renderRowActions = (row: MRT_Row<CashTransactionResponse>) =>
    renderTransactionActions(row.original);

  const renderTransactionActions = (transaction: CashTransactionResponse) => {
    if (!isEditableCashTransactionType(transaction.type)) return null;

    return (
      <BoxFlexEnd>
        <IconButton
          aria-label={`Edit cash flow ${transaction.id}`}
          onClick={() => handleClickEditForm(transaction.id)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label={`Delete cash flow ${transaction.id}`}
          onClick={() => handleClickDelete(transaction)}
          color="error"
          loading={
            deleteCashTransaction.isPending &&
            deleteCashTransaction.variables === transaction.id
          }
        >
          <DeleteIcon />
        </IconButton>
      </BoxFlexEnd>
    );
  };

  const renderMobileCard = (transaction: CashTransactionResponse) => {
    const actions = renderTransactionActions(transaction);

    return (
      <Card variant="outlined" sx={{ borderRadius: "16px" }}>
        <CardContent sx={{ padding: "16px !important" }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {transaction.description || "Transaksi arus kas"}
            </Typography>
            <Chip
              label={cashTransactionTypeLabels[transaction.type]}
              color={cashTransactionTypeColorMapping[transaction.type]}
              size="small"
            />
          </Box>
          <Stack spacing={0.75} sx={{ mt: 1.5 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
            >
              <Typography variant="body2">Jumlah</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currencyFormatter.format(transaction.amount)}
              </Typography>
            </Box>
            <Typography variant="body2">
              Tanggal: {formatLocalDate(transaction.transactionAt)}
            </Typography>
            {transaction.referenceId && (
              <Typography variant="body2" color="text.secondary">
                Referensi: {transaction.referenceId}
              </Typography>
            )}
          </Stack>
          {actions && (
            <>
              <Divider sx={{ my: 1.5 }} />
              {actions}
            </>
          )}
        </CardContent>
      </Card>
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

      <Stack spacing={4}>
        <Stack spacing={3}>
          <PageTitle
            title="Arus Kas"
            subTitle="Melihat dan mengelola arus kas, investasi, dan bagi hasil"
            addButton={renderAddButton()}
          />

          <ReportDate
            endDate={endDate}
            startDate={startDate}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
          />
        </Stack>

        <CashDetails endDate={endDate} startDate={startDate} />

        <CustomTable
          columns={columns}
          {...tableEmptyStates}
          renderMobileCard={renderMobileCard}
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
          enableRowActions
          columnRowActionsSize={100}
          renderRowActions={({ row }) => renderRowActions(row)}
          searchPlaceholder="Cari berdasarkan deskripsi atau jenis transaksi"
        />
      </Stack>
    </Box>
  );
}
