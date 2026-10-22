import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomAutocomplete from "@/components/custom-autocomplete";
import CustomInput from "@/components/custom-input";
import CustomInputNumber from "@/components/custom-input-number";
import FormDrawer from "@/components/form-drawer";
import { BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyInputLabel } from "@/styled/CustomTypography";
import { currencyFormatter } from "@/utils/currency";
import useOrderForm from "./OrderForm.hooks";
import type { OrderFormProps } from "./OrderForm.types";
import { emptyOrderItem } from "./OrderForm.constants";

export default function OrderForm(props: OrderFormProps) {
  const {
    control,
    fields,
    productOptions,
    orderItemsValues,
    isLoading,
    isLoadingGetOptions,
    sellingPriceMapping,
    stockMapping,
    append,
    handleRemoveOrderItem,
    handleSubmit,
    onSubmit,
  } = useOrderForm(props);

  const total = (orderItemsValues ?? []).reduce(
    (sum, item) =>
      sum +
      (item.quantity ?? 0) *
        (sellingPriceMapping[item.productId?.value ?? ""] ?? 0),
    0,
  );

  return (
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

        <Typography
          sx={{ fontWeight: 600, marginBottom: "16px", marginTop: "8px" }}
        >
          Produk Penjualan
        </Typography>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {fields.map((field, index) => (
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
                    autocompleteProps={{
                      options: (productOptions ?? []).map((item) => ({
                        label: `${item.name} (${currencyFormatter.format(item.sellingPrice)})`,
                        value: item.id,
                      })),
                      loading: isLoadingGetOptions,
                    }}
                  />
                </Grid>
                <Grid size={3}>
                  <CustomInputNumber
                    name={`orderItems.${index}.quantity`}
                    control={control}
                    // label="Jumlah"
                    placeholder="1"
                    renderErrorMessage
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              <BoxFlexSpaceBetween>
                <Typography variant="body2">Stok</Typography>
                <Typography variant="body2">
                  {orderItemsValues?.[index]?.productId?.value
                    ? stockMapping[orderItemsValues?.[index]?.productId?.value]
                    : "-"}
                </Typography>
              </BoxFlexSpaceBetween>

              <BoxFlexSpaceBetween>
                <Typography variant="body2">Harga</Typography>
                <Typography variant="body2">
                  {orderItemsValues?.[index]?.productId?.value
                    ? currencyFormatter.format(
                        sellingPriceMapping[
                          orderItemsValues?.[index]?.productId?.value
                        ],
                      )
                    : "-"}
                </Typography>
              </BoxFlexSpaceBetween>

              <BoxFlexSpaceBetween>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  {orderItemsValues?.[index]?.quantity &&
                  orderItemsValues?.[index]?.productId?.value
                    ? currencyFormatter.format(
                        orderItemsValues?.[index]?.quantity *
                          sellingPriceMapping[
                            orderItemsValues?.[index]?.productId?.value
                          ],
                      )
                    : "-"}
                </Typography>
              </BoxFlexSpaceBetween>
            </Box>
          ))}
        </Stack>

        <BoxFlexEnd sx={{ marginTop: "16px" }}>
          <Button
            size="small"
            type="button"
            startIcon={<AddIcon />}
            disabled={isLoading}
            onClick={() => append({ ...emptyOrderItem })}
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
  );
}
