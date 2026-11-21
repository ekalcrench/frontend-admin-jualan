import { z } from "zod";
import type {
  OptionFormProps,
  OptionFormValues,
} from "./ModifierOptionForm.types";

export const modifierOptionFormSchema = z.object({
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
  isActive: z.boolean(),
});

export const emptyModifierOptionFormValues: OptionFormValues = {
  name: "",
  description: "",
  price: 0,
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
    isActive: option.isActive,
  };
}
