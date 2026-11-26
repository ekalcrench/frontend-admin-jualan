import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export type InventoryUnit = "GRAM" | "ML" | "PCS";
export type InventoryPolicy = "STRICT" | "ALLOW_NEGATIVE";

export interface CreateInventoryItem {
  name: string;
  unit: InventoryUnit;
}

export interface EditInventoryItem extends Partial<CreateInventoryItem> {
  id: string;
}

export interface InventoryItemResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  name: string;
  unit: InventoryUnit;
  totalStock: number;
  totalCost: number;
  averageCost: number;
}

export interface InventoryItemFilterPayload extends DefaultFilter {
  search?: string;
  unit?: InventoryUnit;
}

export interface InventoryItemOptions {
  id: string;
  name: string;
  unit: InventoryUnit;
}

export interface InventoryItemAssets {
  totalAssets: number;
}
