import { Dispatch, SetStateAction } from "react";

export interface PreparationFormProps {
  open: boolean;
  id?: string;
  onClose: () => void;
  onOpen: () => void;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

export interface PreparationItemFormValues {
  id?: string;
  inventoryItemId: { label: string; value: string } | null;
  quantity: number | null;
}

export interface PreparationFormValues {
  outputInventoryItemId: { label: string; value: string } | null;
  name: string;
  preparedAt: string;
  outputQuantity: number | null;
  notes: string;
  preparationItems: PreparationItemFormValues[];
  isHasNoExpired: boolean;
  expiredAt: string | undefined;
}
