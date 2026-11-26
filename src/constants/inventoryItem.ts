import { InventoryUnit } from "@/types/inventoryItem";

export const inventoryUnit: Record<InventoryUnit, InventoryUnit> = {
  GRAM: "GRAM",
  ML: "ML",
  PCS: "PCS",
};

export const inventoryUnitLabels: Record<InventoryUnit, string> = {
  GRAM: "gr",
  ML: "ml",
  PCS: "pcs",
};

export const inventoryUnitOptions: InventoryUnit[] = [
  inventoryUnit.GRAM,
  inventoryUnit.ML,
  inventoryUnit.PCS,
];
