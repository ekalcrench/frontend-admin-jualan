import { Box, Button, Stack, Typography } from "@mui/material";
import useUsersPage from "./UsersPage.hooks";
import CustomTable from "@/components/custom-table";
import { User, UserOrganization } from "@/types/user";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex } from "@/styled/CustomBox";
import {
  userOrganizationRole,
  userOrganizationStatus,
  userRole,
  userStatus,
} from "@/constants/user";
import useAuthStore from "@/store/auth-store";
import AddIcon from "@mui/icons-material/Add";
import UserForm from "./components/user-form";
import { SyntheticEvent } from "react";

export default function UsersPage() {
  const {
    activateOrganizationUser,
    approveOrganizationUser,
    columns,
    data,
    editingRoleId,
    editOrganizationUser,
    isLoading,
    isError,
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

  const renderRowActions = (user: UserOrganization) => (
    <BoxFlex sx={{ gap: "4px" }}>
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

  const renderSaveAndCancelChangeRole = (user: UserOrganization) => (
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
              Mengatur semua user yang terdaftar di{" "}
              {organization?.name ?? "UMKM"}
            </Typography>
          </Box>
        </Box>
        <CustomTable<UserOrganization>
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
          addButton={renderAddButton()}
        />
      </Stack>
    </Box>
  );
}
