import { InventoryUnit } from "@/types/inventoryItem";
import { InventoryTransactionType } from "@/types/inventoryTransaction";
import { ChipProps } from "@mui/material";
import { inventoryUnitLabels } from "./inventoryItem";

export const inventoryTransactionTypeLabels: Record<
  InventoryTransactionType,
  string
> = {
  PURCHASE: "Purchases",
  SALE: "Penjualan",
  ADJUSTMENT_IN: "Penyesuaian Masuk",
  ADJUSTMENT_OUT: "Penyesuaian Keluar",
  WASTE: "Barang Rusak",
  RETURN: "Retur",
};

export const inventoryTransactionTypeColors: Record<
  InventoryTransactionType,
  ChipProps["color"]
> = {
  PURCHASE: "success",
  SALE: "info",
  ADJUSTMENT_IN: "success",
  ADJUSTMENT_OUT: "warning",
  WASTE: "error",
  RETURN: "default",
};

export const inventoryTransactionQuantity = (
  type: InventoryTransactionType,
  quantity: number,
  unit: InventoryUnit,
): string => {
  const localQuantity = quantity.toLocaleString("id-ID");
  return {
    PURCHASE: `+${localQuantity} ${inventoryUnitLabels[unit]}`,
    SALE: `-${localQuantity} ${inventoryUnitLabels[unit]}`,
    ADJUSTMENT_IN: `+${localQuantity} ${inventoryUnitLabels[unit]}`,
    ADJUSTMENT_OUT: `-${localQuantity} ${inventoryUnitLabels[unit]}`,
    WASTE: `-${localQuantity} ${inventoryUnitLabels[unit]}`,
    RETURN: `+${localQuantity} ${inventoryUnitLabels[unit]}`,
  }[type];
};
