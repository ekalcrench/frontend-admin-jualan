import { BaseApiResponse } from "./api";

export interface Organization extends BaseApiResponse {
  id: string;
  name: string;
  logoUrl: string;
}
