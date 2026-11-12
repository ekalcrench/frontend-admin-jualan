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
import { OrderResponse } from "@/types/order";
import OrderForm from "./components/order-form";
import useSalesPage from "./SalesPage.hooks";
import { StackDetailPanel } from "./SalesPage.styles";
import { orderStatus, orderTypeLabels } from "@/constants/order";
import ReportDate from "@/components/report-date";
import SalesOverview from "./components/sales-overview";
import PageTitle from "@/components/page-title";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function SalesPage() {
  const {
    columns,
    connectionStatus,
    data,
    deleteOrder,
    editingOrderId,
    endDate,
    isChecking,
    isError,
    isFormOpen,
    isLoading,
    isPrinting,
    markPaidOrder,
    search,
    sortBy,
    startDate,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleClickMarkPaid,
    handlePrint,
    handleResetFilter,
    refreshPrinter,
    setEndDate,
    setIsFormOpen,
    setStartDate,
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
      {row.original.status === orderStatus.UNPAID ? (
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
      ) : connectionStatus !== "ready" && connectionStatus !== "checking" ? (
        <Button
          color="warning"
          startIcon={<RefreshIcon />}
          onClick={() => refreshPrinter()}
          size="small"
        >
          Printer
        </Button>
      ) : (
        <Button
          disabled={connectionStatus !== "ready"}
          startIcon={<PrintIcon />}
          onClick={() => handlePrint(row.original)}
          loading={isPrinting || isChecking}
          size="small"
        >
          Print
        </Button>
      )}
    </BoxFlex>
  );

  const renderDetailPanel = (row: MRT_Row<OrderResponse>) => (
    <StackDetailPanel spacing={2}>
      <Typography>Penjualan #{row.original.orderNumber}</Typography>

      <Box>
        <Typography>{`Dibuat\t: ${formatLocalDate(row.original.createdAt)}`}</Typography>
        <Typography>{`ID Referensi\t: ${row.original.referenceId}`}</Typography>
      </Box>

      {row.original.type === "DELIVERY" && row.original.deliveryOrder && (
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {orderTypeLabels[row.original.type]}
          </Typography>
          <Typography>{`Penerima\t: ${row.original.deliveryOrder.name}`}</Typography>
          <Typography>{`Telepon\t: ${row.original.deliveryOrder.phone}`}</Typography>
          <Typography>{`Alamat\t: ${row.original.deliveryOrder.address}`}</Typography>
          <Typography>{`Ongkos Kirim\t: ${currencyFormatter.format(Number(row.original.deliveryOrder.deliveryFee))}`}</Typography>
        </Box>
      )}

      {row.original.type === "TAKEAWAY" && row.original.takeawayOrder && (
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {orderTypeLabels[row.original.type]}
          </Typography>
          <Typography>{`Pelanggan\t: ${row.original.takeawayOrder.name}`}</Typography>
          {row.original.takeawayOrder.phone && (
            <Typography>{`Telepon\t: ${row.original.takeawayOrder.phone}`}</Typography>
          )}
          <Typography>{`Waktu Pengambilan\t: ${formatLocalDate(row.original.takeawayOrder.pickUpTime)}`}</Typography>
        </Box>
      )}

      {row.original.type === "DINE_IN" && row.original.dineInOrder && (
        <Box>
          <Typography sx={{ fontWeight: 600 }}>
            {orderTypeLabels[row.original.type]}
          </Typography>
          <Typography>{`Meja\t: ${row.original.dineInOrder.table.tableNumber}`}</Typography>
          {row.original.dineInOrder.name && (
            <Typography>{`Pelanggan\t: ${row.original.dineInOrder.name}`}</Typography>
          )}
          <Typography>{`Jumlah Tamu\t: ${row.original.dineInOrder.guestCount}`}</Typography>
        </Box>
      )}

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

      <Stack spacing={4}>
        <Stack spacing={3}>
          <PageTitle
            title="Penjualan"
            subTitle="Mengelola dan melihat keseluruhan transaksi penjualan produk"
          />

          <ReportDate
            endDate={endDate}
            startDate={startDate}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
          />
        </Stack>

        <SalesOverview endDate={endDate} startDate={startDate} />

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
