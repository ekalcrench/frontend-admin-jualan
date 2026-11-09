import { z } from "zod";
import type { InventoryLotFormValues } from "./InventoryLotForm.types";

export const inventoryLotFormSchema = z.object({
  remainingQuantity: z
    .number("Masukkan sisa stok")
    .min(0, "Sisa stok tidak boleh kurang dari 0"),
  receivedAt: z.string().min(1, "Masukkan tanggal diterima"),
  expiredAt: z.string(),
});

export const emptyInventoryLotFormValues: InventoryLotFormValues = {
  remainingQuantity: null,
  receivedAt: "",
  expiredAt: "",
};
