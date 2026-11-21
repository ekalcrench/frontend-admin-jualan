export interface ProductModifierGroupOption {
  id: string;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  minSelection: number;
  maxSelection: number;
  isActive: boolean;
  optionsCount?: number;
}

export interface ProductModifierSectionProps {
  options: ProductModifierGroupOption[];
  selectedIds: string[];
  isLoading: boolean;
  isError: boolean;
  disabled: boolean;
  onChange(ids: string[]): void;
  onRetry(): void;
}
