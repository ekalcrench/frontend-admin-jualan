import { ReceiptBlock } from "@/services/printer/printer.types";
import { OrderResponse } from "@/types/order";
import { currencyFormatter } from "./currency";
import { OrganizationResponse } from "@/types/organization";
import { formatLocalDatePrint } from "./dateTime";
import { numberFormat } from "./number";
import { orderType, orderTypePrintLabels } from "@/constants/order";

export function formatReceiptLabel(
  label: string,
  value: string,
  width = 14,
): string {
  return `${label.padEnd(width)}: ${value}`;
}

export function buildReceipt(
  order: OrderResponse,
  organization: OrganizationResponse,
): ReceiptBlock[] {
  return [
    {
      type: "image",
      base64: organization.logoBase64,
      align: "center",
      dither: false,
    },

    // { type: "feed" },

    // {
    //   type: "text",
    //   text: organization.name,
    //   align: "center",
    // },

    { type: "feed" },

    {
      type: "text",
      align: "center",
      text: `${organization.address}`,
    },
    {
      type: "text",
      align: "center",
      text: `No. Telp ${organization.phone}`,
    },

    { type: "divider", char: "=" },

    {
      type: "text",
      align: "center",
      text: "Jenis Order:",
    },
    {
      type: "text",
      align: "center",
      text: orderTypePrintLabels[order.type],
      size: "large",
    },

    { type: "divider" },

    {
      type: "text",
      text: formatReceiptLabel("Nomor Order", order.orderNumber),
    },
    {
      type: "text",
      text: formatReceiptLabel("Waktu", formatLocalDatePrint(new Date())),
    },
    {
      type: "text",
      text: formatReceiptLabel("Kasir", order.cashierName),
    },

    { type: "divider" },

    ...order.orderItems.flatMap((item) => [
      {
        type: "text" as const,
        text: item.product.name,
      },
      {
        type: "row" as const,
        left: `   ${item.quantity}x ${numberFormat.format(item.unitPrice)}`,
        right: numberFormat.format(
          Number(item.quantity) * Number(item.unitPrice),
        ),
      },
    ]),

    { type: "divider" },

    {
      type: "text",
      text: `Total QTY: ${numberFormat.format(order.totalQuantity)}`,
    },

    { type: "divider" },

    {
      type: "row",
      left: "Subtotal",
      right: currencyFormatter.format(order.totalAmount),
    },
    ...(order.type === orderType.DELIVERY && order.deliveryOrder
      ? [
          {
            type: "row" as const,
            left: "Biaya Pengiriman",
            right: currencyFormatter.format(order.deliveryOrder.deliveryFee),
          },
        ]
      : []),
    {
      type: "row",
      left: "Total",
      right: currencyFormatter.format(
        order.totalAmount + (order.deliveryOrder?.deliveryFee ?? 0),
      ),
      bold: true,
    },
    // {
    //   type: "text",
    //   text: "*Harga yang tertera sudah termasuk PPN",
    // },

    { type: "divider" },

    {
      type: "row",
      left: "Tunai",
      right: currencyFormatter.format(
        order.totalAmount + (order.deliveryOrder?.deliveryFee ?? 0),
      ),
    },
    // {
    //   type: "row",
    //   left: "Kembalian",
    //   right: currencyFormatter.format(0),
    // },

    { type: "divider", char: "=" },

    { type: "feed" },

    {
      type: "text",
      text: `Terima kasih telah berbelanja di ${organization.name}`,
      align: "center",
    },

    { type: "feed" },

    {
      type: "text",
      text: "Instagram: sotopadanguninurul",
      align: "center",
    },
    {
      type: "text",
      text: "TikTok: sotopadanguninurul",
      align: "center",
    },
  ];
}
