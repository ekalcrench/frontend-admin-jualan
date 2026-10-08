import { DefaultFilter } from "./table";

export interface PurchaseFilterPayload extends DefaultFilter {
  search?: string;
}
