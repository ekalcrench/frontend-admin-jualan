import z from "zod";
import { SocialMediaFormValues, UmkmFormValues } from "./UmkmForm.types";

const fileSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Pilih foto UMKM",
  )
  .refine((file) => file.type.startsWith("image/"), "File harus berupa gambar");

const socialMediaSchema = z.object({
  platform: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { error: "Pilih platform sosial media" },
  ),
  username: z
    .string("Masukkan username sosial media")
    .min(1, "Masukkan username sosial media"),
});

const umkmFormFields = {
  name: z.string("Masukkan nama UMKM").min(1, "Masukkan nama UMKM"),
  username: z.string("Masukkan username UMKM").min(1, "Masukkan username UMKM"),
  email: z.email("Masukkan email PIC/UMKM"),
  address: z.string("Masukkan alamat UMKM").min(1, "Masukkan alamat UMKM"),
  phone: z
    .string("Masukkan nomor yang bisa dihubungi")
    .min(1, "Masukkan nomor yang bisa dihubungi"),
};

export const umkmFormSchema = z.object({
  ...umkmFormFields,
  socialMedias: z.array(socialMediaSchema),
  file: fileSchema,
});

export const umkmEditFormSchema = z.object({
  ...umkmFormFields,
  socialMedias: z.array(socialMediaSchema),
  file: fileSchema.optional(),
});

export const emptySocialMediaFormValues: SocialMediaFormValues = {
  platform: null,
  username: "",
};

export const emptyUmkmFormValues: UmkmFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  address: "",
  socialMedias: [{ ...emptySocialMediaFormValues }],
  file: undefined as unknown as File,
};
