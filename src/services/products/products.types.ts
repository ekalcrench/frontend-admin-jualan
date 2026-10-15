export interface CreateProductIngredients {
  inventoryItemId: string;
  quantity: number;
}

export interface CreateProduct {
  name: string;
  sellingPrice: number;
  productIngredients: CreateProductIngredients[];
}

export type EditProductIngredients =
  | (Partial<CreateProductIngredients> & {
      id: string;
    })
  | CreateProductIngredients;

export interface EditProduct extends Partial<
  Omit<CreateProduct, "productIngredients">
> {
  id: string;
  productIngredients?: EditProductIngredients[];
  deletedProductIngredientIds?: string[];
}
