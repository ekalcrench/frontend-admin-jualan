import z from "zod";

export const loginSchema = z.object({
  email: z.email("Masukkan email yang valid"),
  password: z.string().min(6, "Minimal 6 huruf"),
});
