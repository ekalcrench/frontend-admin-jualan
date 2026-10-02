import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export type InventoryUnit = "GRAM" | "ML" | "PCS";

export interface InventoryItem extends BaseApiResponse {
  id: string;
  organizationId: string;
  name: string;
  unit: InventoryUnit;
}

export interface InventoryItemByPages extends InventoryItem {
  totalStock: number;
  averageCost: number;
}

export interface InventoryItemFilterPayload extends DefaultFilter {
  search?: string;
}
