export const requiredPasswordValidation = "Minimal 6 huruf";

export const requiredValidation = (fieldName?: string) => {
  if (!fieldName) return "Masukkan data Anda";

  return `Masukkan ${fieldName} Anda`;
};

export const requiredEmailValidation = "Masukkan email yang valid";
