import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import type { MRT_Row } from "material-react-table";
import { useNavigate } from "react-router-dom";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import PageTitle from "@/components/page-title";
import ModifierGroupForm from "@/components/product-modifier/modifier-group-form";
import { paths } from "@/constants/path";
import useProductModifierAccess from "@/hooks/useProductModifierAccess";
import { BoxFlex } from "@/styled/CustomBox";
import type { ProductModifierGroupResponse } from "@/types/productModifier";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import ModifierGroupCard from "./components/modifier-group-card";
import useProductModifiersPage from "./ProductModifiersPage.hooks";

export default function ProductModifiersPage() {
  const {
    columns,
    data,
    deleteGroup,
    editingGroup,
    isFormOpen,
    isLoading,
    isError,
    refetch,
    search,
    setActive,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleClickToggleActive,
    handleResetFilter,
    setIsFormOpen,
  } = useProductModifiersPage();

  const { canManage } = useProductModifierAccess();
  const navigate = useNavigate();

  const groups = data?.items ?? [];
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "grup variasi",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
    emptyAction: canManage ? (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickAddForm}
      >
        Tambah Grup Variasi
      </Button>
    ) : undefined,
  });

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
      sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}
    >
      Tambah Grup Variasi
    </Button>
  );

  const renderRowActions = (row: MRT_Row<ProductModifierGroupResponse>) => (
    <BoxFlex sx={{ gap: "2px" }}>
      <Tooltip title="Lihat detail">
        <IconButton
          aria-label={`Lihat detail ${row.original.name}`}
          color="primary"
          onClick={() => navigate(paths.productModifierDetail(row.original.id))}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>

      {canManage && (
        <>
          <Tooltip title="Edit grup">
            <IconButton
              aria-label={`Edit ${row.original.name}`}
              onClick={() => handleClickEditForm(row.original)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={row.original.isActive ? "Nonaktifkan grup" : "Aktifkan grup"}
          >
            <IconButton
              aria-label={
                row.original.isActive
                  ? `Nonaktifkan ${row.original.name}`
                  : `Aktifkan ${row.original.name}`
              }
              color={row.original.isActive ? "warning" : "success"}
              loading={
                setActive.isPending &&
                setActive.variables?.id === row.original.id
              }
              onClick={() => handleClickToggleActive(row.original)}
            >
              {row.original.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Hapus grup">
            <IconButton
              aria-label={`Hapus ${row.original.name}`}
              color="error"
              loading={
                deleteGroup.isPending &&
                deleteGroup.variables === row.original.id
              }
              onClick={() => handleClickDelete(row.original)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </BoxFlex>
  );

  const renderMobileCard = (group: ProductModifierGroupResponse) => (
    <ModifierGroupCard
      group={group}
      canManage={canManage}
      isToggling={setActive.isPending && setActive.variables?.id === group.id}
      isDeleting={deleteGroup.isPending && deleteGroup.variables === group.id}
      onView={(value) => navigate(paths.productModifierDetail(value.id))}
      onEdit={handleClickEditForm}
      onToggleActive={handleClickToggleActive}
      onDelete={handleClickDelete}
    />
  );

  return (
    <Box>
      <ModifierGroupForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        group={editingGroup}
      />

      <Stack spacing={4}>
        <PageTitle
          title="Variasi & Add-on"
          subTitle="Kelola pilihan tambahan dan variasi yang dapat digunakan pada berbagai produk."
          addButton={renderAddButton()}
        />

        <CustomTable<ProductModifierGroupResponse>
          columns={columns}
          data={groups}
          renderMobileCard={renderMobileCard}
          isLoading={isLoading}
          isError={isError}
          {...tableEmptyStates}
          emptyMessage="Belum ada grup variasi. Tambahkan grup variasi pertama Anda."
          page={data?.pagination.page}
          size={data?.pagination.size}
          totalRows={data?.pagination.total}
          totalPages={data?.pagination.totalPages}
          handleChangePage={handleChangePage}
          initialState={{ columnVisibility: { sortOrder: false } }}
          sortBy={{
            direction: getSortDirection(sortBy),
            id: removeSortByDirection(sortBy),
          }}
          onSortChange={handleChangeSort}
          handleResetFilter={handleResetFilter}
          search={search}
          handleSearch={handleChangeSearch}
          searchPlaceholder="Cari berdasarkan nama grup variasi"
          enableRowActions
          columnRowActionsSize={canManage ? 190 : 56}
          renderRowActions={({ row }) => renderRowActions(row)}
        />
      </Stack>
    </Box>
  );
}
