import { BaseApiResponse } from "./api";
import { InventoryItemOptions } from "./inventoryItem";
import { DefaultFilter } from "./table";

export interface ProductFilterPayload extends DefaultFilter {
  search?: string;
}

interface ProductIngredients {
  id: string;
  quantity: number;
  unitCost: number;
  inventoryItem: InventoryItemOptions;
}

export interface ProductResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  name: string;
  sellingPrice: number;
  productIngredients: ProductIngredients[];
}

export interface ProductOptions {
  id: string;
  name: string;
  sellingPrice: number;
}
