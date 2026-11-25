import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { MRT_Row } from "material-react-table";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyTab } from "@/styled/CustomTypography";
import { PreparationResponse } from "@/types/preparations";
import { formatLocalDate } from "@/utils/dateTime";
import { currencyFormatter } from "@/utils/currency";
import PreparationForm from "./components/preparation-form";
import useInventoryProductionsPage from "./InventoryProductionsPage.hooks";
import { preparationStatus } from "@/constants/production";
import useAuthStore from "@/store/auth-store";
import { userOrganizationRole } from "@/constants/user";
import PageTitle from "@/components/page-title";

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
    refetch,
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
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "produksi inventaris",
    search,
    onResetFilter: handleResetFilter,
    onRetry: refetch,
  });

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Produksi
    </Button>
  );

  const renderRowActions = (row: MRT_Row<PreparationResponse>) =>
    renderPreparationActions(row.original);

  const renderPreparationActions = (preparation: PreparationResponse) => (
    <BoxFlexEnd>
      {preparation.status === preparationStatus.DRAFT && (
        <>
          <Button
            color="success"
            size="small"
            startIcon={<CheckCircleIcon />}
            sx={{ marginRight: "4px" }}
            onClick={() => handleClickComplete(preparation.id)}
            loading={
              completePreparation.isPending &&
              completePreparation.variables === preparation.id
            }
          >
            Selesai
          </Button>
          <IconButton
            aria-label={`Edit produksi ${preparation.name ?? preparation.id}`}
            onClick={() => handleClickEditForm(preparation.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label={`Hapus produksi ${preparation.name ?? preparation.id}`}
            onClick={() => handleClickDelete(preparation)}
            color="error"
            loading={
              deletePreparation.isPending &&
              deletePreparation.variables === preparation.id
            }
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
      {preparation.status === preparationStatus.COMPLETED &&
        organization?.role === userOrganizationRole.OWNER && (
          <IconButton
            aria-label={`Hapus produksi ${preparation.name ?? preparation.id}`}
            onClick={() => handleClickDelete(preparation)}
            color="error"
            loading={
              deletePreparation.isPending &&
              deletePreparation.variables === preparation.id
            }
          >
            <DeleteIcon />
          </IconButton>
        )}
    </BoxFlexEnd>
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
          <>
            <TypographyTab>{`Catatan\t:\n${row.original.notes}`}</TypographyTab>
          </>
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

  const renderMobileCard = (preparation: PreparationResponse) => (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <BoxFlexSpaceBetween sx={{ alignItems: "flex-start", gap: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>
            {preparation.name || `Produksi #${preparation.id}`}
          </Typography>
          <Chip
            label={preparation.status === "COMPLETED" ? "Selesai" : "Draft"}
            size="small"
            color={preparation.status === "COMPLETED" ? "success" : "warning"}
          />
        </BoxFlexSpaceBetween>
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          <Typography variant="body2">
            Barang hasil: {preparation.outputInventoryItem.name}
          </Typography>
          <Typography variant="body2">
            Jumlah hasil:{" "}
            {`${Number(preparation.outputQuantity).toLocaleString("id-ID")} ${inventoryUnitLabels[preparation.outputInventoryItem.unit]}`}
          </Typography>
          <Typography variant="body2">
            Tanggal: {formatLocalDate(preparation.preparedAt)}
          </Typography>
          <Typography variant="body2">
            Total biaya:{" "}
            {currencyFormatter.format(Number(preparation.outputTotalCost))}
          </Typography>
          {preparation.notes && (
            <Typography variant="body2">
              Catatan: {preparation.notes}
            </Typography>
          )}
        </Stack>
        {preparation.preparationItems.length > 0 && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Bahan Produksi
            </Typography>
            <Stack spacing={0.5}>
              {preparation.preparationItems.map((item) => (
                <BoxFlexSpaceBetween key={item.id} sx={{ gap: 1 }}>
                  <Typography variant="body2">
                    {item.inventoryItem.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${item.quantity.toLocaleString("id-ID")} ${inventoryUnitLabels[item.inventoryItem.unit]}`}
                  </Typography>
                </BoxFlexSpaceBetween>
              ))}
            </Stack>
          </>
        )}
        <Divider sx={{ my: 1.5 }} />
        {renderPreparationActions(preparation)}
      </CardContent>
    </Card>
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

      <Stack spacing={4}>
        <PageTitle
          title="Produksi Inventaris"
          subTitle="Mengatur barang yang sudah melalui proses produksi dan siap dijual"
          addButton={renderAddButton()}
        />

        <CustomTable<PreparationResponse>
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
              notes: false,
              createdAt: false,
              updatedAt: false,
            },
          }}
          sortBy={{
            direction: sortBy.startsWith("-") ? "desc" : "asc",
            id: sortBy.replace(/^-/, ""),
          }}
          onSortChange={handleChangeSort}
          handleResetFilter={handleResetFilter}
          search={search}
          handleSearch={handleChangeSearch}
          enableRowActions
          columnRowActionsSize={220}
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan nama produksi atau barang"
        />
      </Stack>
    </Box>
  );
}
