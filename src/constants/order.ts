import { OrderStatus } from "@/types/order";
import { ChipProps } from "@mui/material";
import { OrderType } from "@/types/order";

export const orderStatus: Record<OrderStatus, OrderStatus> = {
  PAID: "PAID",
  UNPAID: "UNPAID",
};

export const orderStatusMapping: Record<OrderStatus, string> = {
  PAID: "Dibayar",
  UNPAID: "Belum Dibayar",
};

export const orderStatusColorMapping: Record<OrderStatus, ChipProps["color"]> =
  {
    UNPAID: "warning",
    PAID: "success",
  };

export const orderType: Record<OrderType, OrderType> = {
  DELIVERY: "DELIVERY",
  DINE_IN: "DINE_IN",
  TAKEAWAY: "TAKEAWAY",
};

export const orderTypeLabels: Record<OrderType, string> = {
  DELIVERY: "Pengiriman",
  TAKEAWAY: "Ambil Sendiri",
  DINE_IN: "Makan di Tempat",
};

export const orderTypePrintLabels: Record<OrderType, string> = {
  DELIVERY: "DELIVERY",
  TAKEAWAY: "TAKEAWAY",
  DINE_IN: "DINE IN",
};

export const orderTypeOptions: OrderType[] = [
  orderType.DELIVERY,
  orderType.DINE_IN,
  orderType.TAKEAWAY,
];
