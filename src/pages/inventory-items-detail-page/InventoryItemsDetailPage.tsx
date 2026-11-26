import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { MRT_Row } from "material-react-table";
import { Navigate, useParams } from "react-router-dom";
import { paths } from "@/constants/path";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import type { InventoryLotResponse } from "@/types/inventoryLot";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import InventoryLotForm from "./components/inventory-lot-form";
import useInventoryItemsDetailPage from "./InventoryItemsDetailPage.hooks";
import PageTitle from "@/components/page-title";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { currencyFormatter } from "@/utils/currency";
import { formatLocalDate, formatLocalDateOnly } from "@/utils/dateTime";
import ReportDate from "@/components/report-date";

export default function InventoryItemsDetailPage() {
  const { inventoryItemId } = useParams<{ inventoryItemId: string }>();

  if (!inventoryItemId) {
    return <Navigate to={paths.inventoryItems} replace />;
  }

  return <InventoryLots inventoryItemId={inventoryItemId} />;
}

function InventoryLots({ inventoryItemId }: { inventoryItemId: string }) {
  const {
    columns,
    data,
    editingLot,
    endDate,
    inventoryItemQuery,
    isError,
    isFormOpen,
    isLoading,
    refetch,
    search,
    sortBy,
    startDate,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickEditForm,
    handleResetFilter,
    setEndDate,
    setIsFormOpen,
    setStartDate,
  } = useInventoryItemsDetailPage(inventoryItemId);

  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "lot stok",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
  });

  const renderRowActions = (row: MRT_Row<InventoryLotResponse>) => (
    <BoxFlexEnd>
      <IconButton
        aria-label={`Edit lot ${row.original.id}`}
        onClick={() => handleClickEditForm(row.original)}
      >
        <EditIcon />
      </IconButton>
    </BoxFlexEnd>
  );

  const renderMobileCard = (lot: InventoryLotResponse) => (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <Typography sx={{ fontWeight: 600 }}>
          {lot.supplierName ?? lot.preparationName ?? "Lot persediaan"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {lot.invoiceNumber
            ? `Invoice ${lot.invoiceNumber}`
            : `Lot #${lot.id}`}
        </Typography>
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          <BoxFlexSpaceBetween>
            <Typography variant="body2">Jumlah awal</Typography>
            <Typography variant="body2">
              {`${lot.quantity.toLocaleString("id-ID")} ${inventoryUnitLabels[inventoryItemQuery.data?.unit ?? "PCS"]}`}
            </Typography>
          </BoxFlexSpaceBetween>
          <BoxFlexSpaceBetween>
            <Typography variant="body2">Sisa stok</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {`${lot.remainingQuantity.toLocaleString("id-ID")} ${inventoryUnitLabels[inventoryItemQuery.data?.unit ?? "PCS"]}`}
            </Typography>
          </BoxFlexSpaceBetween>
          <BoxFlexSpaceBetween>
            <Typography variant="body2">Biaya per stok</Typography>
            <Typography variant="body2">
              {currencyFormatter.format(lot.unitCost)}
            </Typography>
          </BoxFlexSpaceBetween>
          <BoxFlexSpaceBetween>
            <Typography variant="body2">Total biaya</Typography>
            <Typography variant="body2">
              {currencyFormatter.format(lot.totalCost)}
            </Typography>
          </BoxFlexSpaceBetween>
          <Typography variant="body2">
            Diterima: {formatLocalDate(lot.receivedAt)}
          </Typography>
          <Typography variant="body2">
            Kedaluwarsa:{" "}
            {lot.expiredAt ? formatLocalDateOnly(lot.expiredAt) : "-"}
          </Typography>
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <BoxFlexSpaceBetween sx={{ justifyContent: "flex-end" }}>
          <IconButton
            aria-label={`Edit lot ${lot.id}`}
            onClick={() => handleClickEditForm(lot)}
          >
            <EditIcon />
          </IconButton>
        </BoxFlexSpaceBetween>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {editingLot && (
        <InventoryLotForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onOpen={() => setIsFormOpen(true)}
          setIsFormOpen={setIsFormOpen}
          lot={editingLot}
        />
      )}
      <Stack spacing={4}>
        <Stack spacing={3}>
          <PageTitle
            title="Detail Inventory Item"
            subTitle={`Lot stok untuk barang ${
              inventoryItemQuery.isLoading ? (
                <Skeleton
                  component="span"
                  variant="text"
                  width={160}
                  sx={{ display: "inline-block", verticalAlign: "middle" }}
                />
              ) : (
                (inventoryItemQuery.data?.name ?? "-")
              )
            }`}
            navigateTo={`${paths.inventoryItems}?page=1&size=20&sortBy=name`}
          />

          <ReportDate
            endDate={endDate}
            startDate={startDate}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
          />
        </Stack>

        <CustomTable<InventoryLotResponse>
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
              invoiceNumber: false,
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
          searchPlaceholder="Cari nama supplier dan nomor invoice"
          enableRowActions
          columnRowActionsSize={80}
          renderRowActions={({ row }) => renderRowActions(row)}
        />
      </Stack>
    </Box>
  );
}
