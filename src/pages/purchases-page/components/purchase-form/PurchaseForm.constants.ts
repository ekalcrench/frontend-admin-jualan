import { z } from "zod";

const purchaseItemSchema = z.object({
  inventoryItemId: z.string().min(1, "Pilih barang persediaan"),
  quantity: z
    .number()
    .nullable()
    .refine((value) => value !== null && value > 0, {
      message: "Harus lebih dari 0",
    }),
  unitCost: z
    .number()
    .nullable()
    .refine((value) => value !== null && value >= 0, {
      message: "Harus lebih dari 0",
    }),
  receivedAt: z.string().min(1, "Masukkan tanggal diterima"),
  expiredAt: z.string().optional(),
});

export const purchaseFormSchema = z.object({
  supplierName: z.string().min(1, "Masukkan nama supplier"),
  invoiceNumber: z.string().min(1, "Masukkan nomor invoice"),
  purchasedAt: z.string().min(1, "Masukkan tanggal pembelian"),
  purchaseItems: z
    .array(purchaseItemSchema)
    .min(1, "Tambahkan minimal satu barang"),
});

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

export const emptyPurchaseItem = {
  inventoryItemId: "",
  quantity: null,
  unitCost: null,
  receivedAt: "",
  expiredAt: "",
};

export const emptyPurchaseFormValues: PurchaseFormValues = {
  supplierName: "",
  invoiceNumber: "",
  purchasedAt: "",
  purchaseItems: [{ ...emptyPurchaseItem }],
};
