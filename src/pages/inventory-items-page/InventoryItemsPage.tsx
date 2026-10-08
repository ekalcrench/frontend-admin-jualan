import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CustomTable from "@/components/custom-table";
import { BoxFlex } from "@/styled/CustomBox";
import { InventoryItemByPages } from "@/types/inventoryItem";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import useInventoryItemsPage from "./InventoryItemsPage.hooks";
import InventoryItemForm from "./components/inventory-item-form";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthStore from "@/store/auth-store/authStore";
import { userOrganizationRole } from "@/constants/user";

export default function InventoryItemsPage() {
  const {
    columns,
    data,
    editingItem,
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
  } = useInventoryItemsPage();

  const organizaiton = useAuthStore((state) => state.organization);

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Barang
    </Button>
  );

  const renderRowActions = (row: { original: InventoryItemByPages }) => (
    <BoxFlex>
      <IconButton
        aria-label={`Edit ${row.original.name}`}
        onClick={() => handleClickEditForm(row.original)}
        color="secondary"
      >
        <EditIcon />
      </IconButton>
      {(organizaiton?.role === userOrganizationRole.OWNER ||
        organizaiton?.role === userOrganizationRole.ADMIN) && (
        <IconButton
          aria-label={`Delete ${row.original.name}`}
          onClick={() => handleClickDelete(row.original.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </BoxFlex>
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
            <Typography variant="h5">Inventory Items</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengelola daftar barang
            </Typography>
          </Box>
        </Box>

        <CustomTable<InventoryItemByPages>
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
          addButton={renderAddButton()}
          columnRowActionsSize={
            organizaiton?.role === userOrganizationRole.MEMBER ? 80 : 110
          }
          enableRowActions
          renderRowActions={({ row }) => renderRowActions(row)}
          searchPlaceholder="Cari berdasarkan nama barang"
        />
      </Stack>
    </Box>
  );
}
