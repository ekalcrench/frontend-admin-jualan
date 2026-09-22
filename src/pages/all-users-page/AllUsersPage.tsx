import { Box, Button, Stack, Typography } from "@mui/material";
import useAllUsersPage from "./AllUsersPage.hooks";
import CustomTable from "@/components/custom-table";
import { User } from "@/types/user";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex } from "@/styled/CustomBox";
import { userStatus } from "@/constants/user";

export default function AllUsersPage() {
  const {
    activateUser,
    columns,
    data,
    editingRoleId,
    editUser,
    isLoading,
    isError,
    search,
    sortBy,
    suspendUser,
    getValues,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickActivate,
    handleClickChangeRole,
    handleClickSuspend,
    handleResetFilter,
    onSaveChangeRole,
    setEditingRoleId,
  } = useAllUsersPage();

  const renderRowActions = (user: User) => (
    <BoxFlex sx={{ gap: "4px" }}>
      <Button
        size="small"
        onClick={() => handleClickChangeRole(user.id, user.role)}
      >
        Ganti Role
      </Button>
      {user.status === userStatus.ACTIVE && (
        <Button
          size="small"
          color="error"
          onClick={() => handleClickSuspend(user.id)}
          loading={suspendUser.isPending && suspendUser.variables === user.id}
        >
          Blokir
        </Button>
      )}
      {user.status === userStatus.SUSPENDED && (
        <Button
          size="small"
          color="success"
          onClick={() => handleClickActivate(user.id)}
          loading={activateUser.isPending && activateUser.variables === user.id}
        >
          Activate
        </Button>
      )}
    </BoxFlex>
  );

  const renderSaveAndCancelChangeRole = (user: User) => (
    <BoxFlex sx={{ gap: "4px" }}>
      <Button
        size="small"
        variant="contained"
        color="success"
        onClick={() => onSaveChangeRole(user.id, getValues("role"))}
        loading={editUser.isPending && editUser.variables?.id === user.id}
      >
        Simpan
      </Button>
      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={() => setEditingRoleId(null)}
      >
        Batal
      </Button>
    </BoxFlex>
  );

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
            <Typography variant="h5">Users</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengatur semua user dari semua UMKM
            </Typography>
          </Box>
        </Box>
        <CustomTable<User>
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
          columnRowActionsSize={220}
          enableRowActions
          renderRowActions={({ row }) =>
            row.original.id === editingRoleId
              ? renderSaveAndCancelChangeRole(row.original)
              : renderRowActions(row.original)
          }
          searchPlaceholder="Cari berdasarkan Nama dan Email"
        />
      </Stack>
    </Box>
  );
}
