import z from "zod";
import { registerVerifySchema } from "./RegisterPageVerify.contants";

export type RegisterFormValues = z.infer<typeof registerVerifySchema>;
