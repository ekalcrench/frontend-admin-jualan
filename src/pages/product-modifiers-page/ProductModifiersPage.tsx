import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import type { MRT_Row } from "material-react-table";
import { useNavigate } from "react-router-dom";
import CustomPagination from "@/components/custom-pagination";
import CustomTable from "@/components/custom-table";
import PageTitle from "@/components/page-title";
import ModifierEmptyState from "@/components/product-modifier/modifier-empty-state";
import ModifierGroupForm from "@/components/product-modifier/modifier-group-form";
import { paths } from "@/constants/path";
import useProductModifierAccess from "@/hooks/useProductModifierAccess";
import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import type { ProductModifierGroupResponse } from "@/types/productModifier";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import ModifierGroupCard from "./components/modifier-group-card";
import ModifierSearchBar from "./components/modifier-search-bar";
import useProductModifiersPage from "./ProductModifiersPage.hooks";

function ModifierGroupCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <BoxFlexSpaceBetween sx={{ alignItems: "flex-start" }}>
          <Box sx={{ width: "70%" }}>
            <Skeleton variant="text" width="70%" height={28} />
            <Skeleton variant="text" width="95%" height={20} />
          </Box>
          <Skeleton variant="rounded" width={64} height={24} />
        </BoxFlexSpaceBetween>

        <Stack direction="row" spacing={1} sx={{ marginTop: "12px" }}>
          <Skeleton variant="rounded" width={64} height={24} />
          <Skeleton variant="rounded" width={70} height={24} />
          <Skeleton variant="rounded" width={90} height={24} />
        </Stack>

        <Divider sx={{ marginY: "12px" }} />
        <Skeleton variant="rounded" width={110} height={32} />
      </CardContent>
    </Card>
  );
}

export default function ProductModifiersPage() {
  const {
    columns,
    data,
    deleteGroup,
    editingGroup,
    isFormOpen,
    isLoading,
    isFetching,
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const groups = data?.items ?? [];
  const isInitialLoading = isLoading && !data;

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

  const renderEmptyState = () => (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: "16px",
        backgroundColor: "background.paper",
      }}
    >
      <ModifierEmptyState
        title="Belum ada grup variasi"
        description="Buat grup variasi untuk menawarkan pilihan tambahan seperti isian ekstra atau tingkat kematangan pada produk Anda."
        action={
          canManage ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickAddForm}
            >
              Tambah Grup Variasi
            </Button>
          ) : undefined
        }
      />
    </Box>
  );

  const renderErrorState = () => (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: "16px",
        backgroundColor: "background.paper",
      }}
    >
      <ModifierEmptyState
        icon={<ErrorOutlineRoundedIcon />}
        title="Gagal memuat grup variasi"
        description="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
        action={
          <Button variant="outlined" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        }
      />
    </Box>
  );

  const renderSearchEmptyContent = () => (
    <ModifierEmptyState
      icon={<SearchOffRoundedIcon />}
      title="Grup variasi tidak ditemukan"
      description={`Tidak ada grup variasi yang cocok dengan pencarian "${search}".`}
      action={
        <Button variant="outlined" onClick={handleResetFilter}>
          Reset Pencarian
        </Button>
      }
    />
  );

  const renderSearchEmptyState = () => (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: "16px",
        backgroundColor: "background.paper",
      }}
    >
      {renderSearchEmptyContent()}
    </Box>
  );

  const renderDesktopEmptyState = () =>
    search ? (
      renderSearchEmptyContent()
    ) : (
      <ModifierEmptyState
        title="Belum ada grup variasi"
        description="Buat grup variasi untuk menawarkan pilihan tambahan seperti isian ekstra atau tingkat kematangan pada produk Anda."
        action={
          canManage ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickAddForm}
            >
              Tambah Grup Variasi
            </Button>
          ) : undefined
        }
      />
    );

  const renderDesktopErrorState = () => (
    <ModifierEmptyState
      icon={<ErrorOutlineRoundedIcon />}
      title="Gagal memuat grup variasi"
      description="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
      action={
        <Button variant="outlined" onClick={() => refetch()}>
          Coba Lagi
        </Button>
      }
    />
  );

  const renderMobileContent = () => {
    if (isInitialLoading) {
      return (
        <Stack spacing={2}>
          <ModifierGroupCardSkeleton />
          <ModifierGroupCardSkeleton />
          <ModifierGroupCardSkeleton />
        </Stack>
      );
    }

    if (isError && groups.length === 0) return renderErrorState();
    if (groups.length === 0) {
      return search ? renderSearchEmptyState() : renderEmptyState();
    }

    return (
      <Stack spacing={2}>
        {groups.map((group) => (
          <ModifierGroupCard
            key={group.id}
            group={group}
            canManage={canManage}
            isToggling={
              setActive.isPending && setActive.variables?.id === group.id
            }
            isDeleting={
              deleteGroup.isPending && deleteGroup.variables === group.id
            }
            onView={(value) => navigate(paths.productModifierDetail(value.id))}
            onEdit={handleClickEditForm}
            onToggleActive={handleClickToggleActive}
            onDelete={handleClickDelete}
          />
        ))}

        <CustomPagination
          page={data?.pagination.page ?? 1}
          size={data?.pagination.size ?? 20}
          totalRows={data?.pagination.total ?? 0}
          totalDisplayedData={groups.length}
          totalPages={data?.pagination.totalPages ?? 1}
          handleChangePage={handleChangePage}
          isLoading={isFetching}
        />
      </Stack>
    );
  };

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

        {isFetching && !isInitialLoading && (
          <LinearProgress sx={{ borderRadius: "8px" }} />
        )}

        {isMobile ? (
          <Stack spacing={2}>
            <BoxFlex sx={{ gap: "8px", alignItems: "stretch" }}>
              <ModifierSearchBar
                value={search}
                placeholder="Cari grup variasi"
                onSearch={handleChangeSearch}
              />
              <Button
                variant="outlined"
                onClick={handleResetFilter}
                sx={{ flexShrink: 0 }}
              >
                Reset
              </Button>
            </BoxFlex>

            {renderMobileContent()}
          </Stack>
        ) : (
          <CustomTable<ProductModifierGroupResponse>
            columns={columns}
            data={groups}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="Belum ada grup variasi. Tambahkan grup variasi pertama Anda."
            renderEmptyState={renderDesktopEmptyState()}
            renderErrorState={renderDesktopErrorState()}
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
        )}
      </Stack>
    </Box>
  );
}
