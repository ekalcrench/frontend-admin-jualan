import { InventoryUnit } from "@/types/inventoryItem";

export interface CreateInventoryItem {
  name: string;
  unit: InventoryUnit;
}

export interface EditInventoryItem extends Partial<CreateInventoryItem> {
  id: string;
}
