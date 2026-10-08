import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export type InventoryUnit = "GRAM" | "ML" | "PCS";

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
}

export interface InventoryItemOptions {
  id: string;
  name: string;
  unit: InventoryUnit;
}
