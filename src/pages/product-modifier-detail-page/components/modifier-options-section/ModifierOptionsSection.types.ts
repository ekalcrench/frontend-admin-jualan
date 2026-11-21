import type { ProductModifierOptionResponse } from "@/types/productModifier";

export interface ModifierOptionsSectionProps {
  options: ProductModifierOptionResponse[];
  canManage: boolean;
  isReorderPending: boolean;
  statusPendingId?: string;
  deletePendingId?: string;
  onAdd(): void;
  onEdit(option: ProductModifierOptionResponse): void;
  onToggleActive(option: ProductModifierOptionResponse): void;
  onDelete(option: ProductModifierOptionResponse): void;
  onMove(index: number, direction: -1 | 1): void;
}
