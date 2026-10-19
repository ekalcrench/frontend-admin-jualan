import { Box, Stack, Typography } from "@mui/material";
import CustomTable from "@/components/custom-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import type { InventoryTransactionResponse } from "@/types/inventoryTransaction";
import useInventoryTransactionsPage from "./InventoryTransactionsPage.hooks";

export default function InventoryTransactionsPage() {
  const {
    columns,
    data,
    isLoading,
    isError,
    search,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleResetFilter,
  } = useInventoryTransactionsPage();

  return (
    <Box>
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
            <Typography variant="h5">Inventory Transactions</Typography>
            <Typography variant="body2" color="text.secondary">
              Melihat riwayat transaksi stok inventory
            </Typography>
          </Box>
        </Box>

        <CustomTable<InventoryTransactionResponse>
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
