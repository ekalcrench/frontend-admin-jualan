import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Fade,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import CustomAutocomplete from "@/components/custom-autocomplete";
import CustomDateTimePicker from "@/components/custom-date-time-picker";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import { BoxCenter, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyInputLabel } from "@/styled/CustomTypography";
import { currencyFormatter } from "@/utils/currency";
import useOrderForm from "./OrderForm.hooks";
import { OrderFormProps } from "./OrderForm.types";
import { emptyOrderItem } from "./OrderForm.constants";
import { orderTypeLabels, orderTypeOptions } from "@/constants/order";
import type { LabelValue } from "@/types/generalTypes";
import { OrderType } from "@/types/order";
import ModifierSelectionDialog from "../modifier-selection-dialog";

export default function OrderForm(props: OrderFormProps) {
  const {
    control,
    fields,
    productOptions,
    orderType,
    orderItemsValues,
    isLoading,
    isLoadingGetOptions,
    sellingPriceMapping,
    stockMapping,
    modifierDialog,
    modifierDialogProductName,
    modifierDialogBasePrice,
    modifierDialogGroups,
    modifierDialogInitialOptionIds,
    checkingProductIndex,
    append,
    handleRemoveOrderItem,
    handleProductSelection,
    handleOpenModifierDialog,
    handleConfirmModifiers,
    handleCloseModifierDialog,
    handleSubmit,
    onSubmit,
  } = useOrderForm(props);

  const renderTypeFields = () => {
    const disabled = isLoading;

    switch (orderType) {
      case "DELIVERY":
        return (
          <>
            <CustomInput
              name="deliveryOrder.name"
              control={control}
              label="Nama Penerima"
              placeholder="John Doe"
              renderErrorMessage
              disabled={disabled}
            />
            <CustomInput
              name="deliveryOrder.phone"
              control={control}
              label="Nomor Telepon"
              placeholder="08xxxxxxxxxx"
              renderErrorMessage
              disabled={disabled}
            />
            <CustomInput
              name="deliveryOrder.address"
              control={control}
              label="Alamat Pengiriman"
              placeholder="Alamat lengkap"
              renderErrorMessage
              disabled={disabled}
              textFieldProps={{ multiline: true, minRows: 2 }}
            />
            <CustomInputNumber
              name="deliveryOrder.deliveryFee"
              control={control}
              label="Ongkos Kirim"
              placeholder="0"
              startAdornment="Rp."
              renderErrorMessage
              disabled={disabled}
            />
            <Grid container columnSpacing={1.5}>
              <Grid size={6}>
                <CustomInputNumber
                  name="deliveryOrder.latitude"
                  control={control}
                  label="Latitude"
                  placeholder="Contoh: -6,2"
                  renderErrorMessage
                  disabled={disabled}
                  allowNegative
                  decimalScale={7}
                />
              </Grid>
              <Grid size={6}>
                <CustomInputNumber
                  name="deliveryOrder.longitude"
                  control={control}
                  label="Longitude"
                  placeholder="Contoh: 106,8"
                  renderErrorMessage
                  disabled={disabled}
                  allowNegative
                  decimalScale={7}
                />
              </Grid>
            </Grid>
          </>
        );
      case "TAKEAWAY":
        return (
          <>
            <CustomInput
              name="takeawayOrder.name"
              control={control}
              label="Nama Pelanggan"
              placeholder="Nama pelanggan"
              renderErrorMessage
              disabled={disabled}
            />
            <CustomInput
              name="takeawayOrder.phone"
              control={control}
              label="Nomor Telepon (Opsional)"
              placeholder="08xxxxxxxxxx"
              renderErrorMessage
              disabled={disabled}
            />
            <CustomDateTimePicker
              name="takeawayOrder.pickUpTime"
              control={control}
              label="Waktu Pengambilan"
              renderErrorMessage
              disabled={disabled}
            />
          </>
        );
      case "DINE_IN":
        return (
          <>
            <CustomInput
              name="dineInOrder.tableId"
              control={control}
              label="ID Meja (Fitur Nanti)"
              placeholder="Masukkan ID meja (Fitur Nanti)"
              renderErrorMessage
              disabled={disabled}
            />
            <CustomInput
              name="dineInOrder.name"
              control={control}
              label="Nama Pelanggan (Opsional)"
              placeholder="Nama pelanggan"
              renderErrorMessage
              disabled={disabled}
            />
            <CustomInputNumber
              name="dineInOrder.guestCount"
              control={control}
              label="Jumlah Tamu"
              placeholder="1"
              decimalScale={0}
              renderErrorMessage
              disabled={disabled}
            />
          </>
        );
      default:
        return <BoxCenter>Pilih Pesanan Anda</BoxCenter>;
    }
  };

  const total = (orderItemsValues ?? []).reduce((sum, item) => {
    const basePrice = item.productId?.value
      ? (sellingPriceMapping[item.productId.value] ?? 0)
      : 0;
    const modifierTotal = (item.modifiers ?? []).reduce(
      (modifierSum, modifier) => modifierSum + modifier.unitPrice,
      0,
    );

    return sum + (basePrice + modifierTotal) * (item.quantity ?? 0);
  }, 0);

  return (
    <>
      <FormDrawer
        open={props.open}
        onClose={props.onClose}
        onOpen={props.onOpen}
        disableCloseOnOutsideInteraction
        title={props.id ? "Edit Penjualan" : "Tambah Penjualan"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomInput
            name="orderNumber"
            control={control}
            label="Nomor Penjualan"
            placeholder="Contoh: INV-001"
            renderErrorMessage
            disabled={isLoading}
          />

          <CustomAutocomplete
            control={control}
            name="type"
            label="Jenis Pesanan"
            placeholder="Pilih jenis pesanan"
            renderErrorMessage
            disabled={isLoading}
            autocompleteProps={{
              options: orderTypeOptions,
              getOptionLabel: (unit) => orderTypeLabels[unit as OrderType],
            }}
          />

          <Collapse in={orderType !== null} timeout={300} unmountOnExit>
            <Fade key={orderType} in={orderType !== null} timeout={250}>
              <Box>{renderTypeFields()}</Box>
            </Fade>
          </Collapse>

          <Typography
            sx={{ fontWeight: 600, marginBottom: "16px", marginTop: "8px" }}
          >
            Produk Penjualan
          </Typography>

          {checkingProductIndex !== null && (
            <LinearProgress sx={{ marginBottom: "8px", borderRadius: "8px" }} />
          )}

          <Stack spacing={2} divider={<Divider flexItem />}>
            {fields.map((field, index) => {
              const item = orderItemsValues?.[index];
              const productId = item?.productId?.value;
              const hasBasePrice =
                Boolean(productId) &&
                sellingPriceMapping[productId ?? ""] !== undefined;
              const basePrice = productId
                ? (sellingPriceMapping[productId] ?? 0)
                : 0;
              const modifierTotal = (item?.modifiers ?? []).reduce(
                (total, modifier) => total + modifier.unitPrice,
                0,
              );
              const quantity = item?.quantity ?? 0;
              const unitTotal = basePrice + modifierTotal;
              const subtotal = unitTotal * quantity;

              return (
                <Box key={field.id}>
                  <BoxFlexSpaceBetween>
                    <TypographyInputLabel>{`Produk ${index + 1}`}</TypographyInputLabel>
                    <IconButton
                      aria-label={`Hapus produk ${index + 1}`}
                      color="error"
                      disabled={isLoading || fields.length === 1}
                      onClick={() => handleRemoveOrderItem(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </BoxFlexSpaceBetween>

                  <Grid container columnSpacing={1.5}>
                    <Grid size={9}>
                      <CustomAutocomplete
                        control={control}
                        name={`orderItems.${index}.productId`}
                        placeholder="Pilih produk"
                        renderErrorMessage
                        disabled={isLoading}
                        overridOnChangeAutocomplete
                        autocompleteProps={{
                          options: (productOptions ?? []).map((product) => ({
                            label: `${product.name} (${currencyFormatter.format(product.sellingPrice)})`,
                            value: product.id,
                          })),
                          loading: isLoadingGetOptions,
                          onChange: (_event, value) => {
                            void handleProductSelection(
                              index,
                              value as LabelValue<string> | null,
                            );
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={3}>
                      <CustomInputNumber
                        name={`orderItems.${index}.quantity`}
                        control={control}
                        placeholder="1"
                        renderErrorMessage
                        disabled={isLoading}
                      />
                    </Grid>
                  </Grid>

                  <BoxFlexSpaceBetween>
                    <Typography variant="body2">Stok</Typography>
                    <Typography variant="body2">
                      {productId
                        ? stockMapping[productId] === null
                          ? "Tidak terbatas"
                          : stockMapping[productId]?.toLocaleString("id-ID") ??
                            "-"
                        : "-"}
                    </Typography>
                  </BoxFlexSpaceBetween>

                  <BoxFlexSpaceBetween>
                    <Typography variant="body2">Harga Dasar</Typography>
                    <Typography variant="body2">
                      {hasBasePrice ? currencyFormatter.format(basePrice) : "-"}
                    </Typography>
                  </BoxFlexSpaceBetween>

                  {(item?.modifiers ?? []).map((modifier, modifierIndex) => (
                    <BoxFlexSpaceBetween
                      key={`${modifier.modifierOptionId ?? modifier.optionName}-${modifierIndex}`}
                      sx={{ paddingLeft: "12px" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {modifier.groupName}: {modifier.optionName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {modifier.unitPrice === 0
                          ? "Gratis"
                          : `+${currencyFormatter.format(modifier.unitPrice)}`}
                      </Typography>
                    </BoxFlexSpaceBetween>
                  ))}

                  <BoxFlexSpaceBetween>
                    <Typography variant="body2">Total Variasi</Typography>
                    <Typography variant="body2">
                      {modifierTotal === 0
                        ? "Gratis"
                        : `+${currencyFormatter.format(modifierTotal)}`}
                    </Typography>
                  </BoxFlexSpaceBetween>

                  <BoxFlexSpaceBetween>
                    <Typography variant="body2">Harga Satuan</Typography>
                    <Typography variant="body2">
                      {hasBasePrice ? currencyFormatter.format(unitTotal) : "-"}
                    </Typography>
                  </BoxFlexSpaceBetween>

                  <BoxFlexSpaceBetween>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">
                      {hasBasePrice && quantity > 0
                        ? currencyFormatter.format(subtotal)
                        : "-"}
                    </Typography>
                  </BoxFlexSpaceBetween>

                  <BoxFlexEnd sx={{ marginTop: "4px" }}>
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<TuneRoundedIcon />}
                      disabled={isLoading || !productId}
                      onClick={() => {
                        void handleOpenModifierDialog(index);
                      }}
                    >
                      {item?.modifiers?.length
                        ? "Ubah Variasi"
                        : "Atur Variasi"}
                    </Button>
                  </BoxFlexEnd>
                </Box>
              );
            })}
          </Stack>

          <BoxFlexEnd sx={{ marginTop: "16px" }}>
            <Button
              size="small"
              type="button"
              startIcon={<AddIcon />}
              disabled={isLoading}
              onClick={() =>
                append({
                  ...emptyOrderItem,
                  modifierOptionIds: [],
                  modifiers: [],
                })
              }
            >
              Tambah Produk
            </Button>
          </BoxFlexEnd>

          <BoxFlexSpaceBetween sx={{ mt: "24px" }}>
            <Typography sx={{ fontWeight: 700 }}>Total Penjualan</Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {currencyFormatter.format(total)}
            </Typography>
          </BoxFlexSpaceBetween>

          <Button
            sx={{ mt: "32px" }}
            type="submit"
            variant="contained"
            fullWidth
            loading={isLoading}
          >
            Simpan Penjualan
          </Button>
        </form>
      </FormDrawer>

      <ModifierSelectionDialog
        open={Boolean(modifierDialog)}
        productName={modifierDialogProductName}
        basePrice={modifierDialogBasePrice}
        groups={modifierDialogGroups}
        initialOptionIds={modifierDialogInitialOptionIds}
        onClose={handleCloseModifierDialog}
        onConfirm={handleConfirmModifiers}
      />
    </>
  );
}
