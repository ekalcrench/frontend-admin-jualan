import type { ProductModifierGroupAssignedProduct } from "@/types/productModifier";

export interface AssignProductsDialogProps {
  open: boolean;
  modifierGroupId: string;
  groupName: string;
  assignedProducts: ProductModifierGroupAssignedProduct[];
  onClose(): void;
}
