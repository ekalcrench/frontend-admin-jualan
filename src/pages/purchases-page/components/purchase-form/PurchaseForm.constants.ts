import { z } from "zod";
import {
  PurchaseFormValues,
  PurchaseItemFormValues,
} from "./PurchaseForm.types";

const purchaseItemSchema = z.object({
  inventoryItemId: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { error: "Pilih barang persediaan" },
  ),
  quantity: z.number("Tidak boleh kosong").positive("Harus lebih dari 0"),
  totalCost: z.number("Tidak boleh kosong").positive("Harus lebih dari 0"),
  receivedAt: z.string().min(1, "Masukkan tanggal diterima"),
  expiredAt: z.string().optional().nullish(),
});

export const purchaseFormSchema = z.object({
  supplierName: z.string().min(1, "Masukkan nama supplier"),
  invoiceNumber: z.string().min(1, "Masukkan nomor invoice"),
  purchasedAt: z.string().min(1, "Masukkan tanggal pembelian"),
  purchaseItems: z
    .array(purchaseItemSchema)
    .min(1, "Tambahkan minimal satu barang"),
});

export const emptyPurchaseItem: PurchaseItemFormValues = {
  inventoryItemId: null,
  quantity: null,
  totalCost: null,
  receivedAt: "",
  expiredAt: undefined,
};

export const emptyPurchaseFormValues: PurchaseFormValues = {
  supplierName: "",
  invoiceNumber: "",
  purchasedAt: "",
  purchaseItems: [{ ...emptyPurchaseItem }],
};
