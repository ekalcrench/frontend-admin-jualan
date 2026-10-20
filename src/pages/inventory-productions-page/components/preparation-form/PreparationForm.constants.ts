import { z } from "zod";
import {
  PreparationFormValues,
  PreparationItemFormValues,
} from "./PreparationForm.types";

const inventoryItemSchema = z.object(
  {
    label: z.string(),
    value: z.string(),
  },
  { error: "Pilih barang persediaan" },
);

const preparationItemSchema = z.object({
  id: z.string().optional(),
  inventoryItemId: inventoryItemSchema,
  quantity: z.number("Harus > 0").positive("Harus > 0"),
});

export const preparationFormSchema = z.object({
  outputInventoryItemId: inventoryItemSchema,
  name: z.string().min(1, "Masukkan nama produksi"),
  preparedAt: z.string().min(1, "Masukkan tanggal produksi"),
  outputQuantity: z.number("Harus > 0").positive("Harus > 0"),
  notes: z.string().optional(),
  preparationItems: z
    .array(preparationItemSchema)
    .min(1, "Tambahkan minimal satu bahan"),
});

export const emptyPreparationItem: PreparationItemFormValues = {
  inventoryItemId: null,
  quantity: null,
};

export const emptyPreparationFormValues: PreparationFormValues = {
  outputInventoryItemId: null,
  name: "",
  preparedAt: "",
  outputQuantity: null,
  notes: "",
  preparationItems: [{ ...emptyPreparationItem }],
};
