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
import useUmkmPage from "./UmkmPage.hooks";
import UmkmForm from "./components/umkm-form";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
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
  } = useUmkmPage();

  const userState = useAuthStore((state) => state.user);
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "UMKM",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
  });

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
          <IconButton onClick={() => handleClickEditForm(id)}>
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

  const renderMobileCard = (organization: OrganizationResponse) => (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <Typography sx={{ fontWeight: 600 }}>{organization.name}</Typography>
        {organization.username && (
          <Typography variant="body2" color="text.secondary">
            @{organization.username}
          </Typography>
        )}
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          <Typography variant="body2">{organization.email}</Typography>
          <Typography variant="body2">{organization.phone}</Typography>
          <Typography variant="body2">{organization.address}</Typography>
        </Stack>
        {organization.socialMedias.length > 0 && (
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            {organization.socialMedias.map((socialMedia) => (
              <Typography
                key={socialMedia.id}
                variant="body2"
                color="text.secondary"
              >
                {`${socialMedia.platform}: ${socialMedia.username}`}
              </Typography>
            ))}
          </Stack>
        )}
        <Divider sx={{ my: 1.5 }} />
        <BoxFlex sx={{ justifyContent: "flex-end" }}>
          {renderRowActions(organization.id)}
        </BoxFlex>
      </CardContent>
    </Card>
  );

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
          addButton={addButton()}
        />

        <CustomTable<OrganizationResponse>
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
            columnVisibility: { createdAt: false, updatedAt: false },
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
            userState?.role === userRole.SUPER_ADMIN ? 120 : 80
          }
          enableRowActions={userState?.role === userRole.USER ? false : true}
          renderRowActions={({ row }) => renderRowActions(row.original.id)}
          searchPlaceholder={
            "Cari berdasarkan Nama, Username, Email, Nomor HP, Alamat, & Media Sosial"
          }
        />
      </Stack>
    </Box>
  );
}
