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
  useMediaQuery,
} from "@mui/material";
import type { MRT_Row } from "material-react-table";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { formatLocalDate } from "@/utils/dateTime";
import { currencyFormatter } from "@/utils/currency";
import { OrderResponse } from "@/types/order";
import OrderForm from "./components/order-form";
import useSalesPage from "./SalesPage.hooks";
import { StackDetailPanel } from "./SalesPage.styles";
import {
  orderStatus,
  orderStatusColorMapping,
  orderStatusMapping,
  orderTypeLabels,
} from "@/constants/order";
import ReportDate from "@/components/report-date";
import SalesOverview from "./components/sales-overview";
import PageTitle from "@/components/page-title";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import PaidIcon from "@mui/icons-material/Paid";

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
    refetch,
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

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "penjualan",
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
      Tambah Penjualan
    </Button>
  );

  const renderRowActions = (row: MRT_Row<OrderResponse>) =>
    renderOrderActions(row.original);

  const renderOrderActions = (order: OrderResponse) => (
    <BoxFlexEnd sx={{ flexWrap: "wrap" }}>
      {order.status === orderStatus.UNPAID ? (
        <>
          <Button
            color="success"
            size="small"
            startIcon={<PaidIcon />}
            sx={{ marginRight: "4px" }}
            onClick={() => handleClickMarkPaid(order.id)}
            loading={
              markPaidOrder.isPending && markPaidOrder.variables === order.id
            }
          >
            Dibayar
          </Button>
          <IconButton
            aria-label={`Edit penjualan ${order.orderNumber}`}
            onClick={() => handleClickEditForm(order.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label={`Hapus penjualan ${order.orderNumber}`}
            onClick={() => handleClickDelete(order.id)}
            color="error"
            loading={
              deleteOrder.isPending && deleteOrder.variables === order.id
            }
          >
            <DeleteIcon />
          </IconButton>
        </>
      ) : !isMobile ? null : connectionStatus !== "ready" &&
        connectionStatus !== "checking" ? (
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
          onClick={() => handlePrint(order)}
          loading={isPrinting || isChecking}
          size="small"
        >
          Print
        </Button>
      )}
    </BoxFlexEnd>
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
                {(item.modifiers ?? []).map((modifier, modifierIndex) => (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    key={`${modifier.modifierOptionId ?? modifier.optionName}-${modifierIndex}`}
                  >
                    {`+ ${modifier.groupName}: ${modifier.optionName} (${currencyFormatter.format(modifier.unitPrice)})`}
                  </Typography>
                ))}
              </Grid>
              <Grid size={2}>
                <Typography>{item.quantity}</Typography>
              </Grid>
              <Grid size={2}>
                <BoxFlexEnd
                  sx={{ flexDirection: "column", alignItems: "flex-end" }}
                >
                  <Typography>
                    {currencyFormatter.format(item.unitTotal ?? item.unitPrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`Dasar ${currencyFormatter.format(item.unitPrice)}`}
                  </Typography>
                </BoxFlexEnd>
              </Grid>
              <Grid size={2}>
                <BoxFlexEnd>
                  <Typography>
                    {currencyFormatter.format(
                      item.subtotal ??
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

  const renderMobileCard = (order: OrderResponse) => (
    <Card variant="outlined" sx={{ borderRadius: "16px" }}>
      <CardContent sx={{ padding: "16px !important" }}>
        <BoxFlexSpaceBetween sx={{ alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600 }}>
              Penjualan #{order.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orderTypeLabels[order.type]}
            </Typography>
          </Box>
          <Chip
            label={orderStatusMapping[order.status]}
            color={orderStatusColorMapping[order.status]}
            size="small"
          />
        </BoxFlexSpaceBetween>
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          <Typography variant="body2">
            Tanggal: {formatLocalDate(order.createdAt)}
          </Typography>
          <BoxFlexSpaceBetween>
            <Typography variant="body2">Jumlah barang</Typography>
            <Typography variant="body2">{order.totalQuantity}</Typography>
          </BoxFlexSpaceBetween>
          <BoxFlexSpaceBetween>
            <Typography variant="body2">Total penjualan</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {currencyFormatter.format(Number(order.totalAmount))}
            </Typography>
          </BoxFlexSpaceBetween>
        </Stack>
        {order.orderItems.length > 0 && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1}>
              {order.orderItems.map((item) => (
                <Box key={item.id}>
                  <BoxFlexSpaceBetween sx={{ gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2">× {item.quantity}</Typography>
                  </BoxFlexSpaceBetween>
                  {(item.modifiers ?? []).map((modifier, modifierIndex) => (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      key={`${modifier.modifierOptionId ?? modifier.optionName}-${modifierIndex}`}
                      sx={{ display: "block" }}
                    >
                      {`+ ${modifier.groupName}: ${modifier.optionName} (${currencyFormatter.format(modifier.unitPrice)})`}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Stack>
          </>
        )}
        <Divider sx={{ my: 1.5 }} />
        {renderOrderActions(order)}
      </CardContent>
    </Card>
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
            addButton={renderAddButton()}
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
          enableRowActions
          columnRowActionsSize={220}
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan nomor penjualan atau produk"
        />
      </Stack>
    </Box>
  );
}
