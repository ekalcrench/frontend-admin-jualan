import { z } from "zod";
import type { OrderFormValues, OrderItemFormValues } from "./OrderForm.types";

const orderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { error: "Pilih produk" },
  ),
  quantity: z.number("Harus diisi").positive("Harus > 0"),
});

export const orderFormSchema = z.object({
  orderNumber: z.string().min(1, "Masukkan nomor penjualan"),
  orderItems: z.array(orderItemSchema).min(1, "Tambahkan minimal satu produk"),
});

export const emptyOrderItem: OrderItemFormValues = {
  productId: null,
  quantity: null,
};

export const emptyOrderFormValues: OrderFormValues = {
  orderNumber: "",
  orderItems: [{ ...emptyOrderItem }],
};
