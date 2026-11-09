import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface OrganizationResponse extends BaseApiResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoBase64: string;
}

export interface OrganizationFilterPayload extends DefaultFilter {
  search?: string;
}
