import z from "zod";
import { UmkmFormValues } from "./UmkmForm.types";
import { socialMediaPlatforms } from "@/constants/organization";

const fileSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Pilih foto UMKM",
  )
  .refine((file) => file.type.startsWith("image/"), "File harus berupa gambar");

const socialMediaSchema = z.object({
  platform: z.enum(socialMediaPlatforms, {
    error: "Pilih platform media sosial",
  }),
  username: z
    .string("Masukkan username media sosial")
    .trim()
    .min(1, "Masukkan username media sosial")
    .max(30, "Username media sosial maksimal 30 karakter"),
});

const umkmFormFields = {
  name: z.string("Masukkan nama UMKM").min(1, "Masukkan nama UMKM"),
  username: z
    .string("Masukkan username UMKM")
    .trim()
    .min(1, "Masukkan username UMKM")
    .max(30, "Username maksimal 30 karakter"),
  email: z.email("Masukkan email PIC/UMKM"),
  address: z.string("Masukkan alamat UMKM").min(1, "Masukkan alamat UMKM"),
  phone: z
    .string("Masukkan nomor yang bisa dihubungi")
    .min(1, "Masukkan nomor yang bisa dihubungi"),
  socialMedias: z.array(socialMediaSchema).superRefine((socialMedias, ctx) => {
    const usedPlatforms = new Set<string>();

    socialMedias.forEach((socialMedia, index) => {
      if (usedPlatforms.has(socialMedia.platform)) {
        ctx.addIssue({
          code: "custom",
          message: "Platform media sosial sudah dipakai",
          path: [index, "platform"],
        });

        return;
      }

      usedPlatforms.add(socialMedia.platform);
    });
  }),
};

export const umkmFormSchema = z.object({
  ...umkmFormFields,
  file: fileSchema,
});

export const umkmEditFormSchema = z.object({
  ...umkmFormFields,
  file: fileSchema.optional(),
});

export const emptyUmkmFormValues: UmkmFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  address: "",
  socialMedias: [],
  file: undefined as unknown as File,
};
