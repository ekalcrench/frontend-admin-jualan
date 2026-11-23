import AddIcon from "@mui/icons-material/Add";
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
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import PurchaseForm from "./components/purchase-form";
import usePurchasesPage from "./PurchasesPage.hooks";
import type { MRT_Row } from "material-react-table";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { TypographyTab } from "@/styled/CustomTypography";
import { formatLocalDate } from "@/utils/dateTime";
import { PurchaseResponse } from "@/types/purchase";
import { StackDetailPanel } from "./PurchasesPage.styles";
import { currencyFormatter } from "@/utils/currency";
import {
  purchaseStatus,
  purchaseStatusColorMapping,
  purchaseStatusMapping,
} from "@/constants/purchase";
import useAuthStore from "@/store/auth-store";
import { userOrganizationRole } from "@/constants/user";
import PageTitle from "@/components/page-title";

export default function PurchasesPage() {
  const {
    columns,
    data,
    deletePurchase,
    editingPurchaseId,
    finalizePurchase,
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
    handleClickFinalize,
    handleResetFilter,
    setIsFormOpen,
  } = usePurchasesPage();

  const organization = useAuthStore((state) => state.organization);
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "pembelian",
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
      Tambah Pembelian
    </Button>
  );

  const renderRowActions = (row: MRT_Row<PurchaseResponse>) =>
    renderPurchaseActions(row.original);

  const renderPurchaseActions = (purchase: PurchaseResponse) => (
    <BoxFlexEnd>
      {purchase.status === purchaseStatus.DRAFT && (
        <>
          <Button
            color="success"
            size="small"
            sx={{ marginRight: "4px" }}
            onClick={() => handleClickFinalize(purchase.id)}
            loading={
              finalizePurchase.isPending &&
              finalizePurchase.variables === purchase.id
            }
          >
            Finalize
          </Button>
          <IconButton
            aria-label={`Edit purchase ${purchase.invoiceNumber ?? purchase.id}`}
            onClick={() => handleClickEditForm(purchase.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label={`Delete purchase ${purchase.invoiceNumber ?? purchase.id}`}
            onClick={() => handleClickDelete(purchase.id)}
            color="error"
            loading={
              deletePurchase.isPending &&
              deletePurchase.variables === purchase.id
            }
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
      {purchase.status === purchaseStatus.FINALIZED &&
        organization?.role === userOrganizationRole.OWNER && (
          <IconButton
            aria-label={`Delete purchase ${purchase.invoiceNumber ?? purchase.id}`}
            onClick={() => handleClickDelete(purchase.id)}
            color="error"
            loading={
              deletePurchase.isPending &&
              deletePurchase.variables === purchase.id
            }
          >
            <DeleteIcon />
          </IconButton>
        )}
    </BoxFlexEnd>
  );

  const renderDetailPanel = (row: MRT_Row<PurchaseResponse>) => (
    <StackDetailPanel spacing={2}>
      <Typography>Purchase #{row.original.invoiceNumber}</Typography>

      <Box>
        <TypographyTab>{`Supplier\t: ${row.original.supplierName}`}</TypographyTab>
        <TypographyTab>{`Tanggal\t: ${formatLocalDate(row.original.purchasedAt)}`}</TypographyTab>
      </Box>

      <Box>
        <Grid container columnSpacing={2}>
          <Grid size={4}>
            <Typography>Stok</Typography>
          </Grid>
          <Grid size={2}>
            <BoxFlexEnd>
              <Typography>Jumlah</Typography>
            </BoxFlexEnd>
          </Grid>
          <Grid size={3}>
            <BoxFlexEnd>
              <Typography>Ukuran Kemasan</Typography>
            </BoxFlexEnd>
          </Grid>
          <Grid size={3}>
            <BoxFlexEnd>
              <Typography>Total Harga</Typography>
            </BoxFlexEnd>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: "4px", marginBottom: "8px" }} />
        <Grid container columnSpacing={2}>
          {row.original.purchaseItems.map((item) => (
            <>
              <Grid size={4}>
                <Typography>{item.inventoryItem.name}</Typography>
              </Grid>
              <Grid size={2}>
                <BoxFlexEnd>
                  <Typography>{item.quantity}</Typography>
                </BoxFlexEnd>
              </Grid>
              <Grid size={3}>
                <BoxFlexEnd>
                  <Typography>
                    {`${item.packageSize} ${inventoryUnitLabels[item.inventoryItem.unit]}`}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
              <Grid size={3}>
                <BoxFlexEnd>
                  <Typography>
                    {currencyFormatter.format(item.totalCost)}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
            </>
          ))}
        </Grid>
        <Divider sx={{ marginTop: "8px", marginBottom: "4px" }} />
        <BoxFlexSpaceBetween>
          <Typography sx={{ fontWeight: 700 }}>Total</Typography>
          <Typography>
            {currencyFormatter.format(
              row.original.purchaseItems.reduce(
                (total, item) => total + Number(item.totalCost),
                0,
              ),
            )}
          </Typography>
        </BoxFlexSpaceBetween>
      </Box>
    </StackDetailPanel>
  );

  const renderMobileCard = (purchase: PurchaseResponse) => {
    const totalCost = purchase.purchaseItems.reduce(
      (total, item) => total + Number(item.totalCost),
      0,
    );

    return (
      <Card variant="outlined" sx={{ borderRadius: "16px" }}>
        <CardContent sx={{ padding: "16px !important" }}>
          <BoxFlexSpaceBetween sx={{ alignItems: "flex-start", gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600 }}>
                {purchase.invoiceNumber || `Pembelian #${purchase.id}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {purchase.supplierName}
              </Typography>
            </Box>
            <Chip
              label={purchaseStatusMapping[purchase.status]}
              size="small"
              color={purchaseStatusColorMapping[purchase.status]}
            />
          </BoxFlexSpaceBetween>
          <Stack spacing={0.75} sx={{ mt: 1.5 }}>
            <Typography variant="body2">
              Tanggal: {formatLocalDate(purchase.purchasedAt)}
            </Typography>
            <Typography variant="body2">
              Jumlah barang: {purchase.purchaseItems.length}
            </Typography>
          </Stack>
          {purchase.purchaseItems.length > 0 && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1}>
                {purchase.purchaseItems.map((item) => (
                  <BoxFlexSpaceBetween key={item.id} sx={{ gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.inventoryItem.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {`${item.quantity} × ${item.packageSize} ${inventoryUnitLabels[item.inventoryItem.unit]}`}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ flexShrink: 0 }}>
                      {currencyFormatter.format(Number(item.totalCost))}
                    </Typography>
                  </BoxFlexSpaceBetween>
                ))}
              </Stack>
            </>
          )}
          <Divider sx={{ my: 1.5 }} />
          <BoxFlexSpaceBetween>
            <Typography sx={{ fontWeight: 600 }}>Total</Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {currencyFormatter.format(totalCost)}
            </Typography>
          </BoxFlexSpaceBetween>
          <Box sx={{ mt: 1 }}>{renderPurchaseActions(purchase)}</Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <PurchaseForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        id={editingPurchaseId}
      />

      <Stack spacing={4}>
        <PageTitle
          title="Belanja"
          subTitle="Mengelola seluruh pembelian stok inventory"
          addButton={renderAddButton()}
        />

        <CustomTable
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
          enableRowActions
          columnRowActionsSize={190}
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan supplier atau nomor invoice"
        />
      </Stack>
    </Box>
  );
}
