import { z } from "zod";
import type {
  ModifierGroupFormProps,
  ModifierGroupFormValues,
} from "./ModifierGroupForm.types";

export const modifierGroupFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Masukkan nama grup variasi")
      .max(255, "Nama grup variasi maksimal 255 karakter"),
    description: z
      .string()
      .max(2000, "Deskripsi maksimal 2000 karakter")
      .optional(),
    isRequired: z.boolean(),
    isMultiple: z.boolean(),
    minSelection: z
      .number("Masukkan jumlah minimum")
      .min(0, "Jumlah minimum tidak boleh negatif")
      .refine(
        (value) => Number.isInteger(value),
        "Jumlah minimum harus bilangan bulat",
      ),
    maxSelection: z
      .number("Masukkan jumlah maksimum")
      .min(0, "Jumlah maksimum tidak boleh negatif")
      .refine(
        (value) => Number.isInteger(value),
        "Jumlah maksimum harus bilangan bulat",
      ),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.isRequired && values.minSelection < 1) {
      context.addIssue({
        code: "custom",
        path: ["minSelection"],
        message: "Grup wajib dipilih, jumlah minimum minimal 1",
      });
    }

    if (!values.isMultiple && values.maxSelection > 1) {
      context.addIssue({
        code: "custom",
        path: ["maxSelection"],
        message: "Pilihan tunggal hanya boleh memiliki maksimal 1 opsi",
      });
    }

    if (values.maxSelection < values.minSelection) {
      context.addIssue({
        code: "custom",
        path: ["maxSelection"],
        message: "Jumlah maksimum tidak boleh lebih kecil dari minimum",
      });
    }
  });

export const emptyModifierGroupFormValues: ModifierGroupFormValues = {
  name: "",
  description: "",
  isRequired: false,
  isMultiple: false,
  minSelection: 0,
  maxSelection: 1,
  isActive: true,
};

export function toModifierGroupFormValues(
  group: ModifierGroupFormProps["group"],
): ModifierGroupFormValues {
  if (!group) return { ...emptyModifierGroupFormValues };

  return {
    name: group.name,
    description: group.description ?? "",
    isRequired: group.isRequired,
    isMultiple: group.isMultiple,
    minSelection: group.minSelection,
    maxSelection: group.maxSelection,
    isActive: group.isActive,
  };
}
