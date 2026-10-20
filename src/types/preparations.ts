import { BaseApiResponse } from "./api";
import { InventoryItemOptions } from "./inventoryItem";
import { DefaultFilter } from "./table";

export interface PreparationFilterPayload extends DefaultFilter {
  search?: string;
}

export type PreparationStatus = "DRAFT" | "COMPLETED";

interface PreparationLotAllocation {
  inventoryLotId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface PreparationItems {
  id: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  inventoryItem: InventoryItemOptions;
  lotAllocations: PreparationLotAllocation;
}

export interface PreparationResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  name: string | null;
  status: PreparationStatus;
  preparedAt: string;
  notes: string | null;
  outputInventoryItemId: string;
  outputQuantity: number;
  outputUnitCost: number;
  outputTotalCost: number;
  outputInventoryItem: InventoryItemOptions;
  preparationItems: PreparationItems[];
}
