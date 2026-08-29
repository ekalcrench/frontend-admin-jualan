import {
  requiredEmailValidation,
  requiredPasswordValidation,
  requiredValidation,
} from "@/constants/validation";
import z from "zod";

export const registerSchema = z
  .object({
    name: z.string(requiredValidation("name")),
    email: z.email(requiredEmailValidation),
    password: z
      .string(requiredPasswordValidation)
      .min(6, requiredPasswordValidation),
    passwordConfirmation: z
      .string(requiredPasswordValidation)
      .min(6, requiredPasswordValidation),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password tidak valid",
    path: ["passwordConfirmation"],
  });
