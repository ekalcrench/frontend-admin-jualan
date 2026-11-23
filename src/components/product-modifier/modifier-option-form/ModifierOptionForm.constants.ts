import { inventoryUnitLabels } from "@/constants/inventoryItem";
import type { LabelValue } from "@/types/generalTypes";
import { z } from "zod";
import type {
  OptionFormProps,
  OptionFormValues,
} from "./ModifierOptionForm.types";

export const NO_INVENTORY_OPTION_VALUE = "";

export const NO_INVENTORY_OPTION: LabelValue<string> = {
  label: "Tidak memakai persediaan",
  value: NO_INVENTORY_OPTION_VALUE,
};

const inventoryItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const modifierOptionFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Masukkan nama opsi")
      .max(255, "Nama opsi maksimal 255 karakter"),
    description: z
      .string()
      .max(2000, "Deskripsi maksimal 2000 karakter")
      .optional(),
    price: z
      .number("Masukkan harga tambahan")
      .min(0, "Harga tambahan tidak boleh negatif")
      .refine(
        (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
        "Harga tambahan maksimal 2 angka desimal",
      ),
    inventoryItemId: inventoryItemSchema.nullable().optional(),
    inventoryQuantity: z.number().nullable().optional(),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    const hasInventoryItem = Boolean(values.inventoryItemId?.value);

    if (!hasInventoryItem) {
      if (
        values.inventoryQuantity !== null &&
        values.inventoryQuantity !== undefined
      ) {
        context.addIssue({
          code: "custom",
          path: ["inventoryQuantity"],
          message: "Kosongkan jumlah persediaan jika tidak memilih barang",
        });
      }

      return;
    }

    if (
      values.inventoryQuantity === null ||
      values.inventoryQuantity === undefined
    ) {
      context.addIssue({
        code: "custom",
        path: ["inventoryQuantity"],
        message: "Masukkan jumlah persediaan yang digunakan",
      });

      return;
    }

    if (
      !Number.isFinite(values.inventoryQuantity) ||
      values.inventoryQuantity <= 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["inventoryQuantity"],
        message: "Jumlah persediaan harus lebih dari 0",
      });

      return;
    }

    if (
      Math.abs(
        values.inventoryQuantity * 100 -
          Math.round(values.inventoryQuantity * 100),
      ) > 1e-8
    ) {
      context.addIssue({
        code: "custom",
        path: ["inventoryQuantity"],
        message: "Jumlah persediaan maksimal 2 angka desimal",
      });
    }
  });

export const emptyModifierOptionFormValues: OptionFormValues = {
  name: "",
  description: "",
  price: 0,
  inventoryItemId: null,
  inventoryQuantity: null,
  isActive: true,
};

export function toModifierOptionFormValues(
  option: OptionFormProps["option"],
): OptionFormValues {
  if (!option) return { ...emptyModifierOptionFormValues };

  return {
    name: option.name,
    description: option.description ?? "",
    price: option.price,
    inventoryItemId: option.inventoryItem
      ? {
          label: `${option.inventoryItem.name} (${inventoryUnitLabels[option.inventoryItem.unit]})`,
          value: option.inventoryItem.id,
        }
      : null,
    inventoryQuantity: option.inventoryQuantity,
    isActive: option.isActive,
  };
}
