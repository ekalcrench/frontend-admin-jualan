import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import type { InventoryTransactionResponse } from "@/types/inventoryTransaction";
import useInventoryTransactionsPage from "./InventoryTransactionsPage.hooks";
import PageTitle from "@/components/page-title";
import {
  inventoryTransactionQuantity,
  inventoryTransactionTypeColors,
  inventoryTransactionTypeLabels,
} from "@/constants/inventoryTransaction";
import { currencyFormatter } from "@/utils/currency";
import { formatLocalDate } from "@/utils/dateTime";

export default function InventoryTransactionsPage() {
  const {
    columns,
    data,
    isLoading,
    isError,
    refetch,
    search,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleResetFilter,
  } = useInventoryTransactionsPage();
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "riwayat inventaris",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
  });

  const renderMobileCard = (transaction: InventoryTransactionResponse) => (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Typography sx={{ fontWeight: 600, minWidth: 0 }}>
            {transaction.inventoryItem.name}
          </Typography>
          <Chip
            label={inventoryTransactionTypeLabels[transaction.type]}
            color={inventoryTransactionTypeColors[transaction.type]}
            size="small"
          />
        </Box>
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Typography variant="body2">Jumlah</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {inventoryTransactionQuantity(
                transaction.type,
                transaction.quantity,
                transaction.inventoryItem.unit,
              )}
            </Typography>
          </Box>
          <Typography variant="body2">
            Tanggal: {formatLocalDate(transaction.createdAt)}
          </Typography>
          {transaction.referenceId && (
            <Typography variant="body2" color="text.secondary">
              Referensi: {transaction.referenceId}
            </Typography>
          )}
          {transaction.unitCost !== undefined && (
            <Typography variant="body2">
              Harga per satuan:{" "}
              {currencyFormatter.format(transaction.unitCost)}
            </Typography>
          )}
          {transaction.totalCost !== undefined && (
            <Typography variant="body2">
              Total harga: {currencyFormatter.format(transaction.totalCost)}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Stack spacing={4}>
        <PageTitle
          title="Riwayat Inventaris"
          subTitle="Melihat catatan perubahan stok barang, mulai dari barang masuk, barang keluar, hingga proses produksi"
        />

        <CustomTable<InventoryTransactionResponse>
          columns={columns}
          {...tableEmptyStates}
          renderMobileCard={renderMobileCard}
          data={data?.items ?? []}
          isLoading={isLoading}
          isError={isError}
          page={data?.pagination?.page}
          size={data?.pagination?.size}
          totalRows={data?.pagination?.total}
          totalPages={data?.pagination?.totalPages}
          handleChangePage={handleChangePage}
          initialState={{
            columnVisibility: {
              id: false,
              referenceId: false,
              updatedAt: false,
            },
          }}
          sortBy={{
            direction: getSortDirection(sortBy),
            id: removeSortByDirection(sortBy),
          }}
          onSortChange={handleChangeSort}
          handleResetFilter={handleResetFilter}
          search={search}
          handleSearch={handleChangeSearch}
          searchPlaceholder="Cari berdasarkan nama barang atau jenis transaksi"
        />
      </Stack>
    </Box>
  );
}
