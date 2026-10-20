import { PreparationFilterPayload } from "@/types/preparations";

export const preparationsKeys = {
  all: ["preparations"] as const,

  lists: ["preparations", "list"] as const,
  list: (params: PreparationFilterPayload) =>
    ["preparations", "list", params] as const,

  details: ["preparations", "detail"] as const,
  detail: (id?: string) => ["preparations", "detail", id] as const,
};
