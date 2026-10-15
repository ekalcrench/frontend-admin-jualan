import { PurchaseStatus } from "@/types/purchase";
import { ChipProps } from "@mui/material";

export const purchaseStatus: Record<PurchaseStatus, PurchaseStatus> = {
  DRAFT: "DRAFT",
  FINALIZED: "FINALIZED",
};

export const purchaseStatusMapping: Record<PurchaseStatus, string> = {
  DRAFT: "Draft",
  FINALIZED: "Final",
};

export const purchaseStatusColorMapping: Record<
  PurchaseStatus,
  ChipProps["color"]
> = {
  DRAFT: "warning",
  FINALIZED: "success",
};
