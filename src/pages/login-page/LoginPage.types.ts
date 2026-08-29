import z from "zod";
import { loginSchema } from "./LoginPage.contants";

export type LoginFormValues = z.infer<typeof loginSchema>;
