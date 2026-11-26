import { PreparationStatus } from "@/types/preparations";

export const preparationStatus: Record<PreparationStatus, PreparationStatus> = {
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
};

export const preparationStatusLabels: Record<PreparationStatus, string> = {
  DRAFT: "Draft",
  COMPLETED: "Selesai",
};

export const preparationStatusOptions: PreparationStatus[] = [
  preparationStatus.DRAFT,
  preparationStatus.COMPLETED,
];
