import { ReceiptBlock } from "@/services/printer/printer.types";
import { OrderResponse } from "@/types/order";
import { currencyFormatter } from "./currency";
import { OrganizationResponse } from "@/types/organization";
import { formatLocalDate } from "./dateTime";
import { numberFormat } from "./number";

export function buildReceipt(
  order: OrderResponse,
  organization: OrganizationResponse,
): ReceiptBlock[] {
  return [
    // {
    //   type: "image",
    //   base64: string,
    //   align: "center",
    //   // dither: false,
    // },
    {
      type: "text",
      text: organization.name,
      align: "center",
      bold: true,
    },

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

    { type: "divider" },

    {
      type: "row" as const,
      left: formatLocalDate(new Date()),
      right: `${order.orderNumber}`,
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
      left: "Total",
      right: currencyFormatter.format(order.totalAmount),
      bold: true,
    },
    { type: "text", align: "right", text: "Lunas" },

    { type: "feed" },

    {
      type: "text",
      text: `Terima kasih telah berbelanja di ${organization.name}`,
      align: "center",
    },
  ];
}
