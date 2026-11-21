import type { ProductModifierGroupAssignedProduct } from "@/types/productModifier";

export interface AssignedProductsSectionProps {
  products: ProductModifierGroupAssignedProduct[];
  canManage: boolean;
  removingProductId?: string;
  onOpenAssign(): void;
  onRemove(product: ProductModifierGroupAssignedProduct): void;
}
