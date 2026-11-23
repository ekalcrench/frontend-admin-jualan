import type { ProductModifierGroupOnProduct } from "@/types/productModifier";

export interface SelectedModifierValue {
  modifierGroupId: string | null;
  modifierOptionId: string | null;
  groupName: string;
  optionName: string;
  unitPrice: number;
}

export interface ModifierSelectionResult {
  optionIds: string[];
  modifiers: SelectedModifierValue[];
  unitTotal: number;
}

export interface ModifierSelectionDialogProps {
  open: boolean;
  productName: string;
  basePrice: number;
  groups: ProductModifierGroupOnProduct[];
  initialOptionIds: string[];
  onClose(): void;
  onConfirm(result: ModifierSelectionResult): void;
}
