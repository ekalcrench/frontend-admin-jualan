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
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { formatLocalDate } from "@/utils/dateTime";
import { currencyFormatter } from "@/utils/currency";
import type { OrderResponse } from "@/types/order";
import OrderForm from "./components/order-form";
import useSalesPage from "./SalesPage.hooks";
import { StackDetailPanel } from "./SalesPage.styles";
import { orderStatus } from "@/constants/order";

export default function SalesPage() {
  const {
    columns,
    data,
    deleteOrder,
    editingOrderId,
    isFormOpen,
    isLoading,
    isError,
    markPaidOrder,
    search,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleClickMarkPaid,
    handleResetFilter,
    setIsFormOpen,
  } = useSalesPage();

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Penjualan
    </Button>
  );

  const renderRowActions = (row: MRT_Row<OrderResponse>) => (
    <BoxFlex>
      {row.original.status === orderStatus.UNPAID && (
        <>
          <Button
            color="success"
            size="small"
            sx={{ marginRight: "4px" }}
            onClick={() => handleClickMarkPaid(row.original.id)}
            loading={
              markPaidOrder.isPending &&
              markPaidOrder.variables === row.original.id
            }
          >
            Dibayar
          </Button>
          <IconButton
            aria-label={`Edit penjualan ${row.original.orderNumber}`}
            onClick={() => handleClickEditForm(row.original.id)}
            color="secondary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label={`Hapus penjualan ${row.original.orderNumber}`}
            onClick={() => handleClickDelete(row.original.id)}
            color="error"
            loading={
              deleteOrder.isPending && deleteOrder.variables === row.original.id
            }
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </BoxFlex>
  );

  const renderDetailPanel = (row: MRT_Row<OrderResponse>) => (
    <StackDetailPanel spacing={2}>
      <Typography>Penjualan #{row.original.orderNumber}</Typography>

      <Box>
        <Typography>{`Dibuat\t: ${formatLocalDate(row.original.createdAt)}`}</Typography>
      </Box>

      <Box>
        <Grid container columnSpacing={2}>
          <Grid size={6}>
            <Typography>Produk</Typography>
          </Grid>
          <Grid size={2}>
            <Typography>Jumlah</Typography>
          </Grid>
          <Grid size={2}>
            <BoxFlexEnd>
              <Typography>Harga Satuan</Typography>
            </BoxFlexEnd>
          </Grid>
          <Grid size={2}>
            <BoxFlexEnd>
              <Typography>Subtotal</Typography>
            </BoxFlexEnd>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: "4px", marginBottom: "8px" }} />
        <Grid container columnSpacing={2}>
          {row.original.orderItems.map((item) => (
            <Grid
              container
              columnSpacing={2}
              size={12}
              key={item.id}
              sx={{ alignItems: "center" }}
            >
              <Grid size={6}>
                <Typography>{item.product.name}</Typography>
              </Grid>
              <Grid size={2}>
                <Typography>{item.quantity}</Typography>
              </Grid>
              <Grid size={2}>
                <BoxFlexEnd>
                  <Typography>
                    {currencyFormatter.format(Number(item.unitPrice))}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
              <Grid size={2}>
                <BoxFlexEnd>
                  <Typography>
                    {currencyFormatter.format(
                      Number(item.quantity) * Number(item.unitPrice),
                    )}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ marginTop: "8px", marginBottom: "4px" }} />
        <BoxFlexSpaceBetween>
          <Typography sx={{ fontWeight: 700 }}>Total</Typography>
          <Typography>
            {currencyFormatter.format(Number(row.original.totalAmount))}
          </Typography>
        </BoxFlexSpaceBetween>
      </Box>
    </StackDetailPanel>
  );

  return (
    <Box>
      <OrderForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        id={editingOrderId}
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
            <Typography variant="h5">Penjualan</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengelola transaksi penjualan produk
            </Typography>
          </Box>
        </Box>

        <CustomTable
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
          addButton={renderAddButton()}
          enableRowActions
          columnRowActionsSize={190}
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan nomor penjualan atau produk"
        />
      </Stack>
    </Box>
  );
}
