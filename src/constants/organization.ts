export type OrganizationRole = "ADMIN" | "MEMBER" | "OWNER";

export const organizationRole: Record<OrganizationRole, OrganizationRole> = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
  OWNER: "OWNER",
};

export type SocialMediaPlatform =
  | "INSTAGRAM"
  | "FACEBOOK"
  | "X"
  | "TIKTOK"
  | "YOUTUBE"
  | "WHATSAPP"
  | "LINKEDIN";

export const socialMediaPlatformLabels: Record<SocialMediaPlatform, string> = {
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  X: "X (Twitter)",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  WHATSAPP: "WhatsApp",
  LINKEDIN: "LinkedIn",
};

export const socialMediaPlatforms = Object.keys(
  socialMediaPlatformLabels,
) as SocialMediaPlatform[];
