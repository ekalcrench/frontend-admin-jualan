import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
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
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import CustomTable, {
  createCustomTableEmptyStates,
} from "@/components/custom-table";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyTab } from "@/styled/CustomTypography";
import type { ProductResponse } from "@/types/product";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import ProductForm from "./components/product-form";
import useProductsPage from "./ProductsPage.hooks";
import { StackDetailPanel } from "./ProductsPage.styles";
import { currencyFormatter } from "@/utils/currency";
import { calculateProductCapitalCost } from "@/utils/product";
import { numberFormat } from "@/utils/number";
import useAuthStore from "@/store/auth-store";
import { userOrganizationRole } from "@/constants/user";
import PageTitle from "@/components/page-title";
import ProductOverview from "./components/product-overview";

export default function ProductsPage() {
  const {
    columns,
    data,
    editingProductId,
    isFormOpen,
    isLoading,
    isError,
    refetch,
    search,
    sortBy,
    deleteProduct,
    editProduct,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleClickToggleActive,
    handleResetFilter,
    setIsFormOpen,
  } = useProductsPage();

  const organizaiton = useAuthStore((state) => state.organization);
  const canManage =
    organizaiton?.role === userOrganizationRole.OWNER ||
    organizaiton?.role === userOrganizationRole.ADMIN;
  const canDelete = organizaiton?.role === userOrganizationRole.OWNER;
  const tableEmptyStates = createCustomTableEmptyStates({
    itemName: "produk",
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
      Tambah Produk
    </Button>
  );

  const renderRowActions = (row: MRT_Row<ProductResponse>) =>
    renderProductActions(row.original);

  const renderProductActions = (product: ProductResponse) => (
    <BoxFlexEnd>
      <IconButton
        aria-label={`Edit product ${product.name}`}
        onClick={() => handleClickEditForm(product.id)}
      >
        <EditIcon />
      </IconButton>
      {canManage && (
        <IconButton
          aria-label={
            product.isActive
              ? `Nonaktifkan produk ${product.name}`
              : `Aktifkan produk ${product.name}`
          }
          onClick={() => handleClickToggleActive(product)}
          color={product.isActive ? "warning" : "success"}
          loading={
            editProduct.isPending && editProduct.variables?.id === product.id
          }
        >
          {product.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
        </IconButton>
      )}
      {canDelete && (
        <IconButton
          aria-label={`Delete product ${product.name}`}
          onClick={() => handleClickDelete(product.id)}
          color="error"
          loading={
            deleteProduct.isPending && deleteProduct.variables === product.id
          }
        >
          <DeleteIcon />
        </IconButton>
      )}
    </BoxFlexEnd>
  );

  const renderDetailPanel = (row: MRT_Row<ProductResponse>) => {
    const totalCapital = calculateProductCapitalCost(
      row.original.productIngredients,
    );
    const sellingPrice = row.original.sellingPrice;

    return (
      <StackDetailPanel spacing={2}>
        <Typography>{row.original.name}</Typography>
        <TypographyTab>
          {`Status\t\t: ${row.original.isActive ? "Aktif" : "Nonaktif"}`}
        </TypographyTab>

        <Grid container columnSpacing={2}>
          <Grid size={6}>
            <TypographyTab>
              {`Harga Jual\t: ${currencyFormatter.format(sellingPrice)}`}
            </TypographyTab>
          </Grid>
          <Grid size={6}>
            <TypographyTab>
              {`Harga Modal\t: ${totalCapital === null ? "-" : currencyFormatter.format(totalCapital)}`}
            </TypographyTab>
          </Grid>
          <Grid size={6}>
            <TypographyTab>
              {`Laba Kotor\t: ${totalCapital === null ? "-" : currencyFormatter.format(sellingPrice - totalCapital)}`}
            </TypographyTab>
          </Grid>
          <Grid size={6}>
            <TypographyTab>
              {`Margin Kotor\t: ${totalCapital === null ? "-" : `${numberFormat.format(((sellingPrice - totalCapital) / sellingPrice) * 100)}%`}`}
            </TypographyTab>
          </Grid>
        </Grid>

        <Box>
          <Grid container columnSpacing={2}>
            <Grid size={6}>
              <Typography>Bahan</Typography>
            </Grid>
            <Grid size={3}>
              <Typography>Jumlah</Typography>
            </Grid>
            <Grid size={3}>
              <BoxFlexEnd>
                <Typography>Modal</Typography>
              </BoxFlexEnd>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: "4px", marginBottom: "8px" }} />
          <Grid container>
            {row.original.productIngredients.map((ingredient) => (
              <Grid container size={12} columnSpacing={2} key={ingredient.id}>
                <Grid size={6}>
                  <Typography>{ingredient.inventoryItem.name}</Typography>
                </Grid>
                <Grid size={3}>
                  <Typography>
                    {`${ingredient.quantity.toLocaleString("id-ID")} ${inventoryUnitLabels[ingredient.inventoryItem.unit]}`}
                  </Typography>
                </Grid>
                <Grid size={3}>
                  <BoxFlexEnd>
                    <Typography>
                      {ingredient.unitCost === null
                        ? "-"
                        : currencyFormatter.format(
                            ingredient.quantity * ingredient.unitCost,
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
              {totalCapital === null ? "-" : currencyFormatter.format(totalCapital)}
            </Typography>
          </BoxFlexSpaceBetween>
        </Box>
      </StackDetailPanel>
    );
  };

  const renderMobileCard = (product: ProductResponse) => {
    const totalCapital = calculateProductCapitalCost(
      product.productIngredients,
    );

    return (
      <Card variant="outlined" sx={{ borderRadius: "16px" }}>
        <CardContent sx={{ padding: "16px !important" }}>
          <BoxFlexSpaceBetween sx={{ alignItems: "flex-start", gap: 1 }}>
            <Typography sx={{ fontWeight: 600, minWidth: 0 }}>
              {product.name}
            </Typography>
            <Chip
              label={product.isActive ? "Aktif" : "Nonaktif"}
              size="small"
              color={product.isActive ? "success" : "default"}
              variant={product.isActive ? "filled" : "outlined"}
            />
          </BoxFlexSpaceBetween>
          <Stack spacing={0.75} sx={{ mt: 1.5 }}>
            <BoxFlexSpaceBetween>
              <Typography variant="body2">Harga jual</Typography>
              <Typography variant="body2">
                {currencyFormatter.format(product.sellingPrice)}
              </Typography>
            </BoxFlexSpaceBetween>
            <BoxFlexSpaceBetween>
              <Typography variant="body2">Harga modal</Typography>
              <Typography variant="body2">
                {totalCapital ? currencyFormatter.format(totalCapital) : "-"}
              </Typography>
            </BoxFlexSpaceBetween>
            <BoxFlexSpaceBetween>
              <Typography variant="body2">Stok</Typography>
              <Typography variant="body2">
                {product.stock === null
                  ? "Tidak terbatas"
                  : product.stock.toLocaleString("id-ID")}
              </Typography>
            </BoxFlexSpaceBetween>
            <Typography variant="body2" color="text.secondary">
              {product.productIngredients.length} bahan
            </Typography>
          </Stack>
          {product.productIngredients.length > 0 && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={0.5}>
                {product.productIngredients.map((ingredient) => (
                  <BoxFlexSpaceBetween key={ingredient.id} sx={{ gap: 1 }}>
                    <Typography variant="body2">
                      {ingredient.inventoryItem.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${ingredient.quantity.toLocaleString("id-ID")} ${inventoryUnitLabels[ingredient.inventoryItem.unit]}`}
                    </Typography>
                  </BoxFlexSpaceBetween>
                ))}
              </Stack>
            </>
          )}
          <Divider sx={{ my: 1.5 }} />
          {renderProductActions(product)}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <ProductForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
        id={editingProductId}
      />

      <Stack spacing={4}>
        <PageTitle
          title="Produk"
          subTitle="Mengelola daftar produk dan bahan yang digunakan"
          addButton={renderAddButton()}
        />

        <ProductOverview />

        <CustomTable<ProductResponse>
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
              id: false,
              createdAt: false,
              updatedAt: false,
            },
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
          columnRowActionsSize={canDelete ? 150 : canManage ? 110 : 80}
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan nama produk"
        />
      </Stack>
    </Box>
  );
}
