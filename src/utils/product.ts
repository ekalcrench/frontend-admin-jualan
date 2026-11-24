import type { ProductResponse } from "@/types/product";

export function calculateProductCapitalCost(
  ingredients: ProductResponse["productIngredients"],
): number | null {
  if (!ingredients.length) return null;

  let total = 0;
  for (const ingredient of ingredients) {
    if (ingredient.unitCost === null) return null;
    total += ingredient.quantity * ingredient.unitCost;
  }

  return total;
}
