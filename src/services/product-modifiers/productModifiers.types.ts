export interface CreateProductModifierGroup {
  name: string;
  description?: string | null;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
  isMultiple: boolean;
  isActive: boolean;
}

export interface UpdateProductModifierGroup extends Partial<CreateProductModifierGroup> {
  id: string;
}

export interface UpdateProductModifierGroupStatus {
  id: string;
  isActive: boolean;
}

export interface CreateProductModifierOption {
  name: string;
  description?: string | null;
  price: number;
  inventoryItemId?: string | null;
  inventoryQuantity?: number | null;
  isActive: boolean;
  sortOrder?: number;
}

export interface CreateProductModifierOptionPayload
  extends CreateProductModifierOption {
  modifierGroupId: string;
}

export interface UpdateProductModifierOption extends Partial<CreateProductModifierOption> {
  id: string;
}

export interface UpdateProductModifierOptionStatus {
  id: string;
  isActive: boolean;
}

export interface ReorderProductModifierOptions {
  modifierGroupId: string;
  optionIds: string[];
}

export interface ReplaceProductModifierGroups {
  productId: string;
  modifierGroupIds: string[];
}

export interface ReorderProductModifierGroups {
  productId: string;
  modifierGroupIds: string[];
}

export interface RemoveProductModifierGroup {
  productId: string;
  modifierGroupId: string;
}

export interface UpdateProductModifierGroupAssignments {
  modifierGroupId: string;
  addProductIds: string[];
  removeProductIds: string[];
}
