import type { ProductModifierGroupResponse } from "@/types/productModifier";

export interface ModifierGroupCardProps {
  group: ProductModifierGroupResponse;
  canManage: boolean;
  isToggling: boolean;
  isDeleting: boolean;
  onView(group: ProductModifierGroupResponse): void;
  onEdit(group: ProductModifierGroupResponse): void;
  onToggleActive(group: ProductModifierGroupResponse): void;
  onDelete(group: ProductModifierGroupResponse): void;
}
