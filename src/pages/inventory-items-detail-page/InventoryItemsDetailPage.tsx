import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { MRT_Row } from "material-react-table";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { paths } from "@/constants/path";
import CustomTable from "@/components/custom-table";
import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import type { InventoryLotResponse } from "@/types/inventoryLot";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import InventoryLotForm from "./components/inventory-lot-form";
import useInventoryItemsDetailPage from "./InventoryItemsDetailPage.hooks";
import PageTitle from "@/components/page-title";

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
    editingLot,
    inventoryItemQuery,
    isError,
    isFormOpen,
    isLoading,
    search,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickEditForm,
    handleResetFilter,
    setIsFormOpen,
  } = useInventoryItemsDetailPage(inventoryItemId);

  const renderRowActions = (row: MRT_Row<InventoryLotResponse>) => (
    <BoxFlex>
      <IconButton
        aria-label={`Edit lot ${row.original.id}`}
        onClick={() => handleClickEditForm(row.original)}
        color="secondary"
      >
        <EditIcon />
      </IconButton>
    </BoxFlex>
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
        <BoxFlexSpaceBetween
          sx={{
            columnGap: "8px",
            flexDirection: { xs: "column-reverse", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
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
          />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Kembali
            </Button>
          </Box>
        </BoxFlexSpaceBetween>

        <CustomTable<InventoryLotResponse>
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
              preparationOutputId: false,
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
