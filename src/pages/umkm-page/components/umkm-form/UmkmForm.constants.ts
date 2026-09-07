import z from "zod";
import { UmkmFormValues } from "./UmkmForm.types";

export const umkmFormSchema = z.object({
  name: z.string("Masukkan nama UMKM").min(1, "Masukkan nama UMKM"),
  email: z.email("Masukkan email PIC/UMKM"),
  address: z.string("Masukkan alamat UMKM").min(1, "Masukkan alamat UMKM"),
  phone: z
    .string("Masukkan nomor yang bisa dihubungi")
    .min(1, "Masukkan nomor yang bisa dihubungi"),
  file: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "Pilih foto UMKM",
    )
    .refine(
      (file) => file.type.startsWith("image/"),
      "File harus berupa gambar",
    ),
});

export const emptyUmkmFormValues: UmkmFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  file: undefined as unknown as File,
};
