import { z } from "zod";
import type { InventoryPolicy } from "@/types/inventoryItem";
import type { ProductStockManagement } from "@/types/product";
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
  isActive: z.boolean(),
  stockManagement: z.enum(["UNTRACKED", "MANUAL", "INVENTORY"]),
  inventoryPolicy: z.enum(["STRICT", "ALLOW_NEGATIVE"]),
  stock: z.number().nullable(),
  productIngredients: z.array(productIngredientSchema),
}).superRefine((values, context) => {
  if (
    values.stockManagement === "MANUAL" &&
    (values.stock === null ||
      !Number.isInteger(values.stock) ||
      values.stock < 0)
  ) {
    context.addIssue({
      code: "custom",
      path: ["stock"],
      message: "Masukkan stok manual berupa bilangan bulat minimal 0",
    });
  }
});

export const emptyProductIngredient: ProductIngredientFormValues = {
  inventoryItemId: null,
  quantity: null,
};

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  sellingPrice: null,
  isActive: true,
  stockManagement: "UNTRACKED" satisfies ProductStockManagement,
  inventoryPolicy: "STRICT" satisfies InventoryPolicy,
  stock: null,
  productIngredients: [],
};
