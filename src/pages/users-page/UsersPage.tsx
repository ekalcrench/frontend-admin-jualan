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
import useUsersPage from "./UsersPage.hooks";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex } from "@/styled/CustomBox";
import {
  userOrganizationRole,
  userOrganizationRoleMapping,
  userOrganizationRoleOptions,
  userOrganizationStatus,
  userOrganizationStatusColorMapping,
  userOrganizationStatusMapping,
  userRole,
} from "@/constants/user";
import useAuthStore from "@/store/auth-store";
import AddIcon from "@mui/icons-material/Add";
import UserForm from "./components/user-form";
import PageTitle from "@/components/page-title";
import { OrganizationUserResponse } from "@/types/organizationUser";

export default function UsersPage() {
  const {
    activateOrganizationUser,
    approveOrganizationUser,
    columns,
    control,
    data,
    editingRoleId,
    editOrganizationUser,
    isLoading,
    isError,
    refetch,
    isFormOpen,
    search,
    sortBy,
    suspendOrganizationUser,
    getValues,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickActivate,
    handleClickApprove,
    handleClickChangeRole,
    handleClickSuspend,
    handleResetFilter,
    onSaveChangeRole,
    setEditingRoleId,
    setIsFormOpen,
  } = useUsersPage();

  const organization = useAuthStore((state) => state.organization);
  const userState = useAuthStore((state) => state.user);
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "pengguna",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
  });

  const renderRowActions = (user: OrganizationUserResponse) => (
    <BoxFlex sx={{ gap: "4px", flexWrap: "wrap" }}>
      {user.status === userOrganizationStatus.PENDING_APPROVAL &&
        organization?.role === userOrganizationRole.OWNER && (
          <Button
            size="small"
            color="success"
            onClick={() => handleClickApprove(user.id)}
            loading={
              approveOrganizationUser.isPending &&
              approveOrganizationUser.variables === user.id
            }
          >
            Approve
          </Button>
        )}
      {user.status === userOrganizationStatus.APPROVED &&
        (organization?.role === userOrganizationRole.OWNER ||
          organization?.role === userOrganizationRole.ADMIN) && (
          <Button
            size="small"
            color="error"
            onClick={() => handleClickSuspend(user.id)}
            loading={
              suspendOrganizationUser.isPending &&
              suspendOrganizationUser.variables === user.id
            }
          >
            Blokir
          </Button>
        )}
      {user.status === userOrganizationStatus.SUSPENDED &&
        (organization?.role === userOrganizationRole.OWNER ||
          organization?.role === userOrganizationRole.ADMIN) && (
          <Button
            size="small"
            color="success"
            onClick={() => handleClickActivate(user.id)}
            loading={
              activateOrganizationUser.isPending &&
              activateOrganizationUser.variables === user.id
            }
          >
            Activate
          </Button>
        )}
      {user.status === userOrganizationStatus.APPROVED &&
        userState?.role === userRole.SUPER_ADMIN && (
          <Button
            size="small"
            onClick={() => handleClickChangeRole(user.id, user.role)}
          >
            Ganti Role
          </Button>
        )}
    </BoxFlex>
  );

  const renderSaveAndCancelChangeRole = (user: OrganizationUserResponse) => (
    <BoxFlex sx={{ gap: "4px" }}>
      <Button
        size="small"
        variant="contained"
        color="success"
        onClick={() => onSaveChangeRole(user.id, getValues("role"))}
        loading={
          editOrganizationUser.isPending &&
          editOrganizationUser.variables?.id === user.id
        }
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

  const renderMobileCard = (user: OrganizationUserResponse) => (
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
            label={userOrganizationStatusMapping[user.status]}
            color={userOrganizationStatusColorMapping[user.status]}
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
                options: userOrganizationRoleOptions.map((role) => role.value),
                disableClearable: true,
                getOptionLabel: (option) =>
                  userOrganizationRoleOptions.find(
                    (role) => role.value === option,
                  )?.label ?? "",
              }}
              size="small"
            />
          ) : (
            <Typography variant="body2">
              Role: {userOrganizationRoleMapping[user.role]}
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

  const renderAddButton = () =>
    organization?.role === userOrganizationRole.ADMIN ||
    organization?.role === userOrganizationRole.OWNER ? (
      <Button startIcon={<AddIcon />} onClick={() => setIsFormOpen(true)}>
        Tambah User
      </Button>
    ) : undefined;

  return (
    <Box>
      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        // id={editFormId}
      />

      <Stack spacing={4}>
        <PageTitle
          title="Pengguna"
          subTitle={`Mengelola semua pengguna yang terdaftar di ${organization?.name ?? "UMKM"}`}
          addButton={renderAddButton()}
        />

        <CustomTable<OrganizationUserResponse>
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
              userId: false,
              approvedAt: false,
              approvedById: false,
              createdAt: false,
              updatedAt: false,
              updatedById: false,
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
            userState?.role === userRole.SUPER_ADMIN ? 220 : 110
          }
          enableRowActions={
            organization?.role === userOrganizationRole.MEMBER ? false : true
          }
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
