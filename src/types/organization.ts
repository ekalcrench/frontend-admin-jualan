import { BaseApiResponse } from "./api";
import { DefaultFilter } from "./table";

export type SocialMediaPlatform =
  | "INSTAGRAM"
  | "TIKTOK"
  | "FACEBOOK"
  | "YOUTUBE"
  | "WHATSAPP"
  | "X"
  | "THREADS";

export interface OrganizationSocialMediaResponse {
  id: string;
  platform: SocialMediaPlatform;
  username: string;
  sortOrder: number;
}

export interface OrganizationResponse extends BaseApiResponse {
  id: string;
  name: string;
  username: string | null;
  address: string;
  phone: string;
  email: string;
  logoBase64: string;
  socialMedias: OrganizationSocialMediaResponse[];
}

export interface OrganizationFilterPayload extends DefaultFilter {
  search?: string;
}
