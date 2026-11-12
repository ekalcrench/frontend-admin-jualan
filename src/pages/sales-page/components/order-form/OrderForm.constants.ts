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

export const orderFormSchema = (stockMapping: Record<string, number>) =>
  z
    .object({
      type: z.enum(["DELIVERY", "TAKEAWAY", "DINE_IN"], {
        error: "Pilih jenis pesanan",
      }),
      orderNumber: z.string().min(1, "Masukkan nomor penjualan"),
      deliveryOrder: z.object({
        deliveryFee: z.number().nullable(),
        name: z.string(),
        address: z.string(),
        phone: z.string(),
        latitude: z.number().nullable(),
        longitude: z.number().nullable(),
      }),
      takeawayOrder: z.object({
        name: z.string(),
        phone: z.string(),
        pickUpTime: z.string(),
      }),
      dineInOrder: z.object({
        tableId: z.string(),
        name: z.string(),
        guestCount: z.number().nullable(),
      }),
      orderItems: z
        .array(orderItemSchema)
        .min(1, "Tambahkan minimal satu produk"),
    })
    .superRefine((data, ctx) => {
      if (data.type === "DELIVERY") {
        if (!data.deliveryOrder.name.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["deliveryOrder", "name"],
            message: "Masukkan nama penerima",
          });
        }
        if (!data.deliveryOrder.address.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["deliveryOrder", "address"],
            message: "Masukkan alamat pengiriman",
          });
        }
        if (!data.deliveryOrder.phone.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["deliveryOrder", "phone"],
            message: "Masukkan nomor telepon",
          });
        }
        if (
          data.deliveryOrder.deliveryFee === null ||
          data.deliveryOrder.deliveryFee < 0
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["deliveryOrder", "deliveryFee"],
            message: "Masukkan ongkos kirim",
          });
        }
        if (
          data.deliveryOrder.latitude === null ||
          data.deliveryOrder.latitude < -90 ||
          data.deliveryOrder.latitude > 90
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["deliveryOrder", "latitude"],
            message: "Masukkan latitude",
          });
        }
        if (
          data.deliveryOrder.longitude === null ||
          data.deliveryOrder.longitude < -180 ||
          data.deliveryOrder.longitude > 180
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["deliveryOrder", "longitude"],
            message: "Masukkan longitude",
          });
        }
      }

      if (data.type === "TAKEAWAY") {
        if (!data.takeawayOrder.name.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["takeawayOrder", "name"],
            message: "Masukkan nama pelanggan",
          });
        }
        if (!data.takeawayOrder.pickUpTime) {
          ctx.addIssue({
            code: "custom",
            path: ["takeawayOrder", "pickUpTime"],
            message: "Pilih waktu pengambilan",
          });
        }
      }

      if (data.type === "DINE_IN") {
        if (!data.dineInOrder.tableId.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["dineInOrder", "tableId"],
            message: "Masukkan ID meja",
          });
        }
        if (
          data.dineInOrder.guestCount === null ||
          !Number.isInteger(data.dineInOrder.guestCount) ||
          data.dineInOrder.guestCount < 1
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["dineInOrder", "guestCount"],
            message: "Jumlah tamu > 1",
          });
        }
      }

      data.orderItems.forEach((item, index) => {
        const stock = stockMapping[item.productId?.value];

        if (stock !== undefined && item.quantity > stock) {
          ctx.addIssue({
            code: "custom",
            path: ["orderItems", index, "quantity"],
            message: "Melebihi stok",
          });
        }
      });
    });

export const emptyOrderItem: OrderItemFormValues = {
  productId: null,
  quantity: null,
};

export const emptyOrderFormValues: OrderFormValues = {
  type: null,
  orderNumber: "",
  deliveryOrder: {
    deliveryFee: null,
    name: "",
    address: "",
    phone: "",
    latitude: null,
    longitude: null,
  },
  takeawayOrder: {
    name: "",
    phone: "",
    pickUpTime: "",
  },
  dineInOrder: {
    tableId: "",
    name: "",
    guestCount: null,
  },
  orderItems: [{ ...emptyOrderItem }],
};
