import { Box, Stack, Typography } from "@mui/material";
import CustomTable from "@/components/custom-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import type { InventoryTransactionResponse } from "@/types/inventoryTransaction";
import useInventoryTransactionsPage from "./InventoryTransactionsPage.hooks";
import PageTitle from "@/components/page-title";

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
      <Stack spacing={4}>
        <PageTitle
          title="Inventory Transactions"
          subTitle="Melihat riwayat transaksi stok inventory"
        />

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
