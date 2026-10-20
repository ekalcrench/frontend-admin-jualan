export interface CreatePreparationItems {
  inventoryItemId: string;
  quantity: number;
}

export interface CreatePreparation {
  outputInventoryItemId: string;
  name: string;
  preparedAt: string;
  outputQuantity: number;
  notes?: string;
  preparationItems: CreatePreparationItems[];
}

export type EditPreparationItems =
  | (Partial<CreatePreparationItems> & {
      id: string;
    })
  | CreatePreparationItems;

export interface EditPreparation extends Partial<
  Omit<CreatePreparation, "preparationItems">
> {
  id: string;
  preparationItems?: EditPreparationItems[];
  deletedPreparationItemIds?: string[];
}
