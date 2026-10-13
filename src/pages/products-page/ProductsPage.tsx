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
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import CustomTable from "@/components/custom-table";
import { BoxFlex, BoxFlexEnd, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { TypographyTab } from "@/styled/CustomTypography";
import type { ProductResponse } from "@/types/product";
import { getSortDirection, removeSortByDirection } from "@/utils/table";
import ProductForm from "./components/product-form";
import useProductsPage from "./ProductsPage.hooks";
import { StackDetailPanel } from "./ProductsPage.styles";
import { currencyFormatter } from "@/utils/currency";
import { numberFormat } from "@/utils/number";
import useAuthStore from "@/store/auth-store";
import { userOrganizationRole } from "@/constants/user";

export default function ProductsPage() {
  const {
    columns,
    data,
    editingProductId,
    isFormOpen,
    isLoading,
    isError,
    search,
    sortBy,
    deleteProduct,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleResetFilter,
    setIsFormOpen,
  } = useProductsPage();

  const organizaiton = useAuthStore((state) => state.organization);

  const renderAddButton = () => (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleClickAddForm}
    >
      Tambah Produk
    </Button>
  );

  const renderRowActions = (row: MRT_Row<ProductResponse>) => (
    <BoxFlex>
      <IconButton
        aria-label={`Edit product ${row.original.name}`}
        onClick={() => handleClickEditForm(row.original.id)}
        color="secondary"
      >
        <EditIcon />
      </IconButton>
      {organizaiton?.role === userOrganizationRole.OWNER && (
        <IconButton
          aria-label={`Delete product ${row.original.name}`}
          onClick={() => handleClickDelete(row.original.id)}
          color="error"
          loading={
            deleteProduct.isPending &&
            deleteProduct.variables === row.original.id
          }
        >
          <DeleteIcon />
        </IconButton>
      )}
    </BoxFlex>
  );

  const renderDetailPanel = (row: MRT_Row<ProductResponse>) => {
    const totalCapital = row.original.productIngredients.reduce(
      (total, item) => total + item.quantity * item.unitCost,
      0,
    );
    const sellingPrice = row.original.sellingPrice;

    return (
      <StackDetailPanel spacing={2}>
        <Typography>{row.original.name}</Typography>

        <Grid container columnSpacing={2}>
          <Grid size={6}>
            <TypographyTab>
              {`Harga Jual\t: ${currencyFormatter.format(sellingPrice)}`}
            </TypographyTab>
          </Grid>
          <Grid size={6}>
            <TypographyTab>
              {`Harga Modal\t: ${currencyFormatter.format(totalCapital)}`}
            </TypographyTab>
          </Grid>
          <Grid size={6}>
            <TypographyTab>
              {`Laba Kotor\t: ${currencyFormatter.format(
                sellingPrice - totalCapital,
              )}`}
            </TypographyTab>
          </Grid>
          <Grid size={6}>
            <TypographyTab>
              {`Margin Kotor\t: ${numberFormat.format(((sellingPrice - totalCapital) / sellingPrice) * 100)}%`}
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
                      {currencyFormatter.format(
                        ingredient.quantity * (ingredient.unitCost ?? 0),
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
            <Typography>{currencyFormatter.format(totalCapital)}</Typography>
          </BoxFlexSpaceBetween>
        </Box>
      </StackDetailPanel>
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
            <Typography variant="h5">Products</Typography>
            <Typography variant="body2" color="text.secondary">
              Mengelola daftar produk dan bahan yang digunakan
            </Typography>
          </Box>
        </Box>

        <CustomTable<ProductResponse>
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
          columnRowActionsSize={
            organizaiton?.role === userOrganizationRole.OWNER ? 110 : 80
          }
          renderRowActions={({ row }) => renderRowActions(row)}
          renderDetailPanel={({ row }) => renderDetailPanel(row)}
          searchPlaceholder="Cari berdasarkan nama produk"
        />
      </Stack>
    </Box>
  );
}
