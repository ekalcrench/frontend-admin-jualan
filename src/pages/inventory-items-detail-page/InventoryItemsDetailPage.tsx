import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { paths } from "@/constants/path";
import CustomTable from "@/components/custom-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import useInventoryItemsDetailPage from "./InventoryItemsDetailPage.hooks";

export default function InventoryItemsDetailPage() {
  const { inventoryItemId } = useParams<{ inventoryItemId: string }>();

  if (!inventoryItemId) {
    return <Navigate to={paths.inventoryItems} replace />;
  }

  return <InventoryLots inventoryItemId={inventoryItemId} />;
}

function InventoryLots({ inventoryItemId }: { inventoryItemId: string }) {
  const navigate = useNavigate();
  const {
    columns,
    data,
    inventoryItemQuery,
    isLoading,
    isError,
    search,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleResetFilter,
  } = useInventoryItemsDetailPage(inventoryItemId);

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
            <Typography variant="h5">Detail Inventory Item</Typography>
            <Typography variant="body2" color="text.secondary">
              Lot stok untuk barang{" "}
              {inventoryItemQuery.isLoading ? (
                <Skeleton
                  component="span"
                  variant="text"
                  width={160}
                  sx={{ display: "inline-block", verticalAlign: "middle" }}
                />
              ) : (
                (inventoryItemQuery.data?.name ?? "-")
              )}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(paths.inventoryItems)}
          >
            Kembali ke Inventory
          </Button>
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
            columnVisibility: {
              id: false,
              inventoryItemId: false,
              purchaseItemId: false,
              createdAt: false,
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
          searchPlaceholder="Cari invoice number"
        />
      </Stack>
    </Box>
  );
}
