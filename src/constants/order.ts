import { OrderStatus } from "@/types/order";
import { ChipProps } from "@mui/material";

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
