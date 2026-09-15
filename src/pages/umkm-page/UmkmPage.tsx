import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useUmkmPage from "./UmkmPage.hooks";
import { UmkmForm } from "./components/umkm-form";
import CustomTable from "@/components/custom-table";
import { Organization } from "@/types/organization";
import { getSortDirection, removeSortByDirection } from "@/utils/table";

export default function UmkmPage() {
  const {
    columns,
    data,
    isFormOpen,
    isLoading,
    isError,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleResetFilter,
    search,
    setIsFormOpen,
  } = useUmkmPage();

  return (
    <Box>
      <UmkmForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
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
          addButton={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
            >
              Add UMKM
            </Button>
          }
        />
      </Stack>
    </Box>
  );
}
