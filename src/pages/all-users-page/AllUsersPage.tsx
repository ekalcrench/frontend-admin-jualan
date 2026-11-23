import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import CustomAutocomplete from "@/components/custom-autocomplete";
import useAllUsersPage from "./AllUsersPage.hooks";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { User } from "@/types/user";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex, BoxFlexEnd } from "@/styled/CustomBox";
import {
  userRole,
  userRoleMapping,
  userStatus,
  userStatusColorMapping,
  userStatusMapping,
} from "@/constants/user";
import useAuthStore from "@/store/auth-store/authStore";
import PageTitle from "@/components/page-title";

export default function AllUsersPage() {
  const {
    activateUser,
    columns,
    control,
    data,
    editingRoleId,
    editUser,
    isLoading,
    isError,
    refetch,
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

  const userState = useAuthStore((state) => state.user);
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "user",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
  });

  const renderRowActions = (user: User) => (
    <BoxFlexEnd sx={{ gap: "4px" }}>
      {user.status === userStatus.ACTIVE &&
        userState?.role === userRole.SUPER_ADMIN && (
          <Button
            size="small"
            color="error"
            onClick={() => handleClickSuspend(user.id)}
            loading={suspendUser.isPending && suspendUser.variables === user.id}
          >
            Blokir
          </Button>
        )}
      {user.status === userStatus.SUSPENDED &&
        (userState?.role === userRole.SUPER_ADMIN ||
          userState?.role === userRole.ADMIN) && (
          <Button
            size="small"
            color="success"
            onClick={() => handleClickActivate(user.id)}
            loading={
              activateUser.isPending && activateUser.variables === user.id
            }
          >
            Activate
          </Button>
        )}
      {user.status === userStatus.ACTIVE &&
        userState?.role === userRole.SUPER_ADMIN && (
          <Button
            size="small"
            onClick={() => handleClickChangeRole(user.id, user.role)}
          >
            Ganti Role
          </Button>
        )}
    </BoxFlexEnd>
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

  const renderMobileCard = (user: User) => (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <BoxFlex sx={{ justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Chip
            label={userStatusMapping[user.status]}
            color={userStatusColorMapping[user.status]}
            size="small"
          />
        </BoxFlex>
        <Box sx={{ mt: 1.5 }}>
          {user.id === editingRoleId ? (
            <CustomAutocomplete
              name="role"
              control={control}
              placeholder="Pilih role"
              autocompleteProps={{
                options: Object.values(userRole),
                disableClearable: true,
              }}
              size="small"
            />
          ) : (
            <Typography variant="body2">
              Role: {userRoleMapping[user.role]}
            </Typography>
          )}
        </Box>
        <BoxFlex sx={{ justifyContent: "flex-end", mt: 1 }}>
          {user.id === editingRoleId
            ? renderSaveAndCancelChangeRole(user)
            : renderRowActions(user)}
        </BoxFlex>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Stack spacing={4}>
        <PageTitle
          title="Users"
          subTitle="Mengatur semua user dari semua UMKM"
        />

        <CustomTable<User>
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
          columnRowActionsSize={
            userState?.role === userRole.SUPER_ADMIN ? 220 : 110
          }
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
