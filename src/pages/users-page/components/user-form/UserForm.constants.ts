import z from "zod";
import { UserFormValues } from "./UserForm.types";

const userFormFields = {
  userId: z.object(
    {
      label: z.string(),
      value: z.string("Masukkan ID Pengguna").min(1, "Masukkan ID Pengguna"),
    },
    { error: "Pilih user" },
  ),
  role: z.object(
    {
      label: z.string(),
      value: z.enum(["ADMIN", "MEMBER", "OWNER"], {
        error: "Masukkan role pengguna",
      }),
    },
    { error: "Pilih role" },
  ),
};

export const userFormSchema = z.object({
  ...userFormFields,
});

export const userEditFormSchema = z.object({
  ...userFormFields,
});

export const emptyUserFormValues: Partial<UserFormValues> = {
  userId: undefined,
  role: undefined,
};
