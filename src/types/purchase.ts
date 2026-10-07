import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface Purchase extends BaseApiResponse {
  id: string;
  organizationId: string;
  name: string;
}

export interface PurchaseByPages extends Purchase {
  totalStock: number;
  averageCost: number;
}

export interface PurchaseFilterPayload extends DefaultFilter {
  search?: string;
}
