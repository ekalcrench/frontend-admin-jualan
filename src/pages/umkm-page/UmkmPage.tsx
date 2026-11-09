import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useUmkmPage from "./UmkmPage.hooks";
import UmkmForm from "./components/umkm-form";
import CustomTable from "@/components/custom-table";
import { OrganizationResponse } from "@/types/organization";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex } from "@/styled/CustomBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useAuthStore from "@/store/auth-store/authStore";
import { userRole } from "@/constants/user";
import PageTitle from "@/components/page-title";

export default function UmkmPage() {
  const {
    columns,
    deleteOrganization,
    data,
    editFormId,
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
  } = useUmkmPage();

  const userState = useAuthStore((state) => state.user);

  const addButton = () => {
    if (userState?.role === userRole.USER) return undefined;

    return (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickAddForm}
      >
        Tambah UMKM
      </Button>
    );
  };

  const renderRowActions = (id: string) => {
    return (
      <BoxFlex>
        {(userState?.role === userRole.SUPER_ADMIN ||
          userState?.role === userRole.ADMIN) && (
          <IconButton onClick={() => handleClickEditForm(id)} color="secondary">
            <EditIcon />
          </IconButton>
        )}

        {userState?.role === userRole.SUPER_ADMIN && (
          <IconButton
            onClick={() => handleClickDelete(id)}
            color="error"
            loading={
              deleteOrganization.isPending &&
              deleteOrganization.variables === id
            }
          >
            <DeleteIcon />
          </IconButton>
        )}
      </BoxFlex>
    );
  };

  return (
    <Box>
      <UmkmForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        id={editFormId}
      />

      <Stack spacing={4}>
        <PageTitle
          title="UMKM"
          subTitle="Mengatur UMKM yang sudah, maupun akan terdaftar dalam sistem"
        />

        <CustomTable<OrganizationResponse>
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
            columnVisibility: { id: false, createdAt: false, updatedAt: false },
          }}
          sortBy={{
            direction: getSortDirection(sortBy),
            id: removeSortByDirection(sortBy),
          }}
          onSortChange={handleChangeSort}
          handleResetFilter={handleResetFilter}
          search={search}
          handleSearch={handleChangeSearch}
          addButton={addButton()}
          columnRowActionsSize={
            userState?.role === userRole.SUPER_ADMIN ? 110 : 80
          }
          enableRowActions={userState?.role === userRole.USER ? false : true}
          renderRowActions={({ row }) => renderRowActions(row.original.id)}
          searchPlaceholder={"Cari berdasarkan Nama, Email, Nomor HP, & Alamat"}
        />
      </Stack>
    </Box>
  );
}
