import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useUmkmPage from "./UmkmPage.hooks";
import UmkmForm from "./components/umkm-form";
import CustomTable from "@/components/custom-table";
import { Organization } from "@/types/organization";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex } from "@/styled/CustomBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

  const addButton = () => {
    return (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickAddForm}
      >
        Add UMKM
      </Button>
    );
  };

  const renderRowActions = (id: string) => {
    return (
      <BoxFlex>
        <IconButton onClick={() => handleClickEditForm(id)} color="secondary">
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleClickDelete(id)}
          color="error"
          loading={
            deleteOrganization.isPending && deleteOrganization.variables === id
          }
        >
          <DeleteIcon />
        </IconButton>
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
            <Typography variant="h5">UMKM</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengatur UMKM yang sudah, maupun akan terdaftar dalam sistem
            </Typography>
          </Box>
        </Box>

        <CustomTable<Organization>
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
          columnRowActionsSize={100}
          enableRowActions
          renderRowActions={({ row }) => renderRowActions(row.original.id)}
          searchPlaceholder={"Cari berdasarkan Nama, Email, Nomor HP, & Alamat"}
        />
      </Stack>
    </Box>
  );
}
