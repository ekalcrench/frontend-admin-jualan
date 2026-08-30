import { requiredEmailValidation } from "@/constants/validation";
import z from "zod";

export const registerVerifySchema = z.object({
  email: z.email(requiredEmailValidation),
  code: z.string().length(6),
});
