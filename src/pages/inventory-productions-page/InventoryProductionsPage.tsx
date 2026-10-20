import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { MRT_Row } from "material-react-table";
import CustomTable from "@/components/custom-table";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyTab } from "@/styled/CustomTypography";
import { PreparationResponse } from "@/types/preparations";
import { formatLocalDate } from "@/utils/dateTime";
import PreparationForm from "./components/preparation-form";
import useInventoryProductionsPage from "./InventoryProductionsPage.hooks";
import { preparationStatus } from "@/constants/production";
import useAuthStore from "@/store/auth-store";
import { userOrganizationRole } from "@/constants/user";

export default function InventoryProductionsPage() {
  const {
    columns,
    completePreparation,
    data,
    deletePreparation,
    editingPreparationId,
    isFormOpen,
    isLoading,
    isError,
    search,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickComplete,
    handleClickDelete,
    handleClickEditForm,
    handleResetFilter,
    setIsFormOpen,
  } = useInventoryProductionsPage();

  const organization = useAuthStore((state) => state.organization);

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Produksi
    </Button>
  );

  const renderRowActions = (row: MRT_Row<PreparationResponse>) => (
    <BoxFlex>
      {row.original.status === preparationStatus.DRAFT && (
        <>
          <Button
            color="success"
            size="small"
            sx={{ marginRight: "4px" }}
            onClick={() => handleClickComplete(row.original.id)}
            loading={
              completePreparation.isPending &&
              completePreparation.variables === row.original.id
            }
          >
            Complete
          </Button>
          <IconButton
            aria-label={`Edit produksi ${row.original.name ?? row.original.id}`}
            onClick={() => handleClickEditForm(row.original.id)}
            color="secondary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label={`Hapus produksi ${row.original.name ?? row.original.id}`}
            onClick={() => handleClickDelete(row.original)}
            color="error"
            loading={
              deletePreparation.isPending &&
              deletePreparation.variables === row.original.id
            }
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
      {row.original.status === preparationStatus.COMPLETED &&
        organization?.role === userOrganizationRole.OWNER && (
          <IconButton
            aria-label={`Hapus produksi ${row.original.name ?? row.original.id}`}
            onClick={() => handleClickDelete(row.original)}
            color="error"
            loading={
              deletePreparation.isPending &&
              deletePreparation.variables === row.original.id
            }
          >
            <DeleteIcon />
          </IconButton>
        )}
    </BoxFlex>
  );

  const renderDetailPanel = (row: MRT_Row<PreparationResponse>) => (
    <Stack
      spacing={2}
      sx={{
        maxWidth: "700px",
        marginX: "auto",
        border: "2px dashed",
        borderColor: "text.primary",
        borderRadius: "4px",
        padding: "12px 16px",
      }}
    >
      <Typography>
        {row.original.name || `Produksi #${row.original.id}`}
      </Typography>
      <Box>
        <TypographyTab>
          {`Tanggal\t: ${formatLocalDate(row.original.preparedAt)}`}
        </TypographyTab>
        <TypographyTab>
          {`Hasil\t: ${row.original.outputInventoryItem.name} (${row.original.outputQuantity} ${inventoryUnitLabels[row.original.outputInventoryItem.unit]})`}
        </TypographyTab>
        {row.original.notes && (
          <TypographyTab>{`Catatan\t: ${row.original.notes}`}</TypographyTab>
        )}
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600 }}>Bahan Produksi</Typography>
        <Grid container columnSpacing={2} sx={{ mt: 1 }}>
          <Grid size={6}>
            <Typography>Bahan</Typography>
          </Grid>
          <Grid size={3}>
            <BoxFlexEnd>
              <Typography>Jumlah</Typography>
            </BoxFlexEnd>
          </Grid>
          <Grid size={3}>
            <BoxFlexEnd>
              <Typography>Biaya</Typography>
            </BoxFlexEnd>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Stack spacing={1}>
          {row.original.preparationItems.map((item) => (
            <Grid container columnSpacing={2} key={item.id}>
              <Grid size={6}>
                <Typography>{item.inventoryItem.name}</Typography>
              </Grid>
              <Grid size={3}>
                <BoxFlexEnd>
                  <Typography>
                    {`${item.quantity.toLocaleString("id-ID")} ${inventoryUnitLabels[item.inventoryItem.unit]}`}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
              <Grid size={3}>
                <BoxFlexEnd>
                  <Typography>
                    {Number(item.totalCost).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
            </Grid>
          ))}
        </Stack>
        <Divider sx={{ my: 1 }} />
        <BoxFlexSpaceBetween>
          <Typography sx={{ fontWeight: 700 }}>Total Biaya</Typography>
          <Typography>
            {Number(row.original.outputTotalCost).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </Typography>
        </BoxFlexSpaceBetween>
      </Box>
    </Stack>
  );

  return (
    <Box>
      <PreparationForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        id={editingPreparationId}
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
            <Typography variant="h5">Inventory Productions</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengelola inventory tingkat lanjut, yaitu inventory yang merupakan
              bahan jadi sebelum dijual
            </Typography>
          </Box>
        </Box>

        <CustomTable<PreparationResponse>
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
            direction: sortBy.startsWith("-") ? "desc" : "asc",
            id: sortBy.replace(/^-/, ""),
          }}
          onSortChange={handleChangeSort}
          handleResetFilter={handleResetFilter}
          search={search}
          handleSearch={handleChangeSearch}
          addButton={renderAddButton()}
          enableRowActions
          columnRowActionsSize={200}
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan nama produksi atau barang hasil"
        />
      </Stack>
    </Box>
  );
}
