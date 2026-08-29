import z from "zod";
import { registerSchema } from "./RegisterPage.contants";

export type RegisterFormValues = z.infer<typeof registerSchema>;
