import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export interface Organization extends BaseApiResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
}

export interface OrganizationFilterPayload extends DefaultFilter {
  search?: string;
  email?: string;
  name?: string;
}

export interface UserOrganization extends Organization {
  role: string;
  status: string;
}
