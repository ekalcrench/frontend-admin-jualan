import { BaseApiResponse } from "./api";
import { InventoryUnit } from "./inventoryItem";
import { DefaultFilter } from "./table";

export interface ProductModifierGroupFilterPayload extends DefaultFilter {
  search?: string;
  isActive?: boolean;
}

export interface ProductModifierOptionInventoryItem {
  id: string;
  name: string;
  unit: InventoryUnit;
}

export interface ProductModifierOptionResponse extends BaseApiResponse {
  id: string;
  modifierGroupId: string;
  name: string;
  description: string | null;
  price: number;
  inventoryItemId: string | null;
  inventoryQuantity: number | null;
  inventoryItem: ProductModifierOptionInventoryItem | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductModifierGroupResponse extends BaseApiResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
  isMultiple: boolean;
  isActive: boolean;
  sortOrder: number;
  optionsCount: number;
  assignedProductsCount: number;
}

export interface ProductModifierGroupAssignedProduct {
  id: string;
  name: string;
  sellingPrice: number;
  mappingId: string;
  sortOrder: number;
}

export interface ProductModifierGroupDetailResponse extends ProductModifierGroupResponse {
  options: ProductModifierOptionResponse[];
  products: ProductModifierGroupAssignedProduct[];
}

export interface ProductModifierProduct {
  id: string;
  name: string;
  sellingPrice: number;
}

export interface ProductModifierGroupOnProduct extends BaseApiResponse {
  id: string;
  mappingId: string;
  name: string;
  description: string | null;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
  isMultiple: boolean;
  isActive: boolean;
  sortOrder: number;
  options: ProductModifierOptionResponse[];
}

export interface ProductModifierGroupsByProductResponse {
  product: ProductModifierProduct;
  modifierGroups: ProductModifierGroupOnProduct[];
}
