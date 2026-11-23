import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { BoxFlex } from "@/styled/CustomBox";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import useInventoryItemsPage from "./InventoryItemsPage.hooks";
import InventoryItemForm from "./components/inventory-item-form";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthStore from "@/store/auth-store/authStore";
import { userOrganizationRole } from "@/constants/user";
import { InventoryItemResponse } from "@/types/inventoryItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { paths } from "@/constants/path";
import PageTitle from "@/components/page-title";
import InventoryItemOverview from "./components/inventory-item-overview";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { currencyFormatter } from "@/utils/currency";

export default function InventoryItemsPage() {
  const {
    columns,
    data,
    editingItem,
    isFormOpen,
    isLoading,
    isError,
    refetch,
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
  } = useInventoryItemsPage();

  const organizaiton = useAuthStore((state) => state.organization);
  const navigate = useNavigate();
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "barang inventaris",
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
      Tambah Barang
    </Button>
  );

  const renderRowActions = (item: InventoryItemResponse) => (
    <BoxFlex>
      <IconButton
        aria-label={`Detail ${item.name}`}
        onClick={() =>
          navigate(
            `${paths.inventoryItemsDetail(item.id)}?page=1&size=20&sortBy=-receivedAt`,
          )
        }
        color="primary"
      >
        <VisibilityIcon />
      </IconButton>
      <IconButton
        aria-label={`Edit ${item.name}`}
        onClick={() => handleClickEditForm(item)}
      >
        <EditIcon />
      </IconButton>
      {(organizaiton?.role === userOrganizationRole.OWNER ||
        organizaiton?.role === userOrganizationRole.ADMIN) && (
        <IconButton
          aria-label={`Delete ${item.name}`}
          onClick={() => handleClickDelete(item.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </BoxFlex>
  );

  const renderMobileCard = (item: InventoryItemResponse) => (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {inventoryUnitLabels[item.unit]}
        </Typography>
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          <BoxFlex sx={{ justifyContent: "space-between", gap: 1 }}>
            <Typography variant="body2">Total stok</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {`${item.totalStock.toLocaleString("id-ID")} ${inventoryUnitLabels[item.unit]}`}
            </Typography>
          </BoxFlex>
          <BoxFlex sx={{ justifyContent: "space-between", gap: 1 }}>
            <Typography variant="body2">Nilai aset</Typography>
            <Typography variant="body2">
              {currencyFormatter.format(item.totalStock * item.averageCost)}
            </Typography>
          </BoxFlex>
          <BoxFlex sx={{ justifyContent: "space-between", gap: 1 }}>
            <Typography variant="body2">Biaya rata-rata</Typography>
            <Typography variant="body2">
              {`${currencyFormatter.format(item.averageCost)} / ${inventoryUnitLabels[item.unit]}`}
            </Typography>
          </BoxFlex>
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <BoxFlex sx={{ justifyContent: "flex-end" }}>
          {renderRowActions(item)}
        </BoxFlex>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <InventoryItemForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        item={editingItem}
      />

      <Stack spacing={4}>
        <PageTitle
          title="Inventaris Barang"
          subTitle="Melihat, menambah, dan mengatur daftar barang beserta stoknya"
          addButton={renderAddButton()}
        />

        <InventoryItemOverview />

        <CustomTable<InventoryItemResponse>
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
          columnRowActionsSize={
            organizaiton?.role === userOrganizationRole.MEMBER ? 110 : 140
          }
          enableRowActions
          renderRowActions={({ row }) => renderRowActions(row.original)}
          searchPlaceholder="Cari berdasarkan nama barang"
        />
      </Stack>
    </Box>
  );
}
