import { z } from "zod";
import { InventoryUnit } from "@/types/inventoryItem";

export const inventoryUnits: InventoryUnit[] = ["GRAM", "ML", "PCS"];

export const inventoryItemFormSchema = z.object({
  name: z.string().min(1, "Masukkan nama barang"),
  unit: z.enum(inventoryUnits, { message: "Pilih satuan barang" }),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemFormSchema>;

export const emptyInventoryItemFormValues: InventoryItemFormValues = {
  name: "",
  unit: "PCS",
};
