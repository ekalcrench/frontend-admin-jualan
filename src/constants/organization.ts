import { SocialMediaPlatform } from "@/types/organization";

export type OrganizationRole = "ADMIN" | "MEMBER" | "OWNER";

export const organizationRole: Record<OrganizationRole, OrganizationRole> = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
  OWNER: "OWNER",
};

export const socialMediaPlatforms: readonly SocialMediaPlatform[] = [
  "INSTAGRAM",
  "TIKTOK",
  "FACEBOOK",
  "YOUTUBE",
  "WHATSAPP",
  "X",
  "THREADS",
];

export const socialMediaPlatformLabels: Record<SocialMediaPlatform, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  FACEBOOK: "Facebook",
  YOUTUBE: "YouTube",
  WHATSAPP: "WhatsApp",
  X: "X",
  THREADS: "Threads",
};
