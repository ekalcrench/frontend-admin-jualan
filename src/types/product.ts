import { BaseApiResponse } from "./api";
import { InventoryItemOptions, InventoryPolicy } from "./inventoryItem";
import { DefaultFilter } from "./table";

export type ProductStockManagement = "UNTRACKED" | "MANUAL" | "INVENTORY";

export interface ProductFilterPayload extends DefaultFilter {
  search?: string;
}

interface ProductIngredients {
  id: string;
  quantity: number;
  unitCost: number | null;
  inventoryItem: InventoryItemOptions;
}

export interface ProductResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  name: string;
  sellingPrice: number;
  isActive: boolean;
  stockManagement: ProductStockManagement;
  inventoryPolicy: InventoryPolicy;
  stock: number | null;
  productIngredients: ProductIngredients[];
}

export interface ProductOptions {
  id: string;
  name: string;
  sellingPrice: number;
  isActive: boolean;
  stockManagement: ProductStockManagement;
  inventoryPolicy: InventoryPolicy;
  stock: number | null;
}

export interface ProductLowestStock {
  name: string;
  stock: number;
}
