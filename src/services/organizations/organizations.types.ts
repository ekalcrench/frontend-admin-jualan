import { SocialMediaPlatform } from "@/types/organization";

export interface CreateOrganizationSocialMedia {
  platform: SocialMediaPlatform;
  username: string;
  sortOrder: number;
}

export interface CreateOrganization {
  name: string;
  username: string;
  address: string;
  email: string;
  phone: string;
  logoBase64: string;
  socialMedias: CreateOrganizationSocialMedia[];
}

export type EditOrganization = Partial<CreateOrganization>;
