import { z } from "zod";
import type {
  ProductFormValues,
  ProductIngredientFormValues,
} from "./ProductForm.types";

const productIngredientSchema = z.object({
  id: z.string().optional(),
  inventoryItemId: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { error: "Pilih barang persediaan" },
  ),
  quantity: z.number("Masukkan jumlah").positive("Harus lebih dari 0"),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Masukkan nama produk"),
  sellingPrice: z
    .number("Masukkan harga jual")
    .positive("Harga jual harus lebih dari 0"),
  productIngredients: z
    .array(productIngredientSchema)
    .min(1, "Tambahkan minimal satu bahan"),
});

export const emptyProductIngredient: ProductIngredientFormValues = {
  inventoryItemId: null,
  quantity: null,
};

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  sellingPrice: null,
  productIngredients: [{ ...emptyProductIngredient }],
};
