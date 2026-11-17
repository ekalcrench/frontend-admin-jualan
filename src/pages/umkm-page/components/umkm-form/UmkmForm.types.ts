import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";
import { LabelValue } from "@/types/generalTypes";
import { OrganizationResponse } from "@/types/organization";

export interface UmkmFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  onSuccess?: (organization: OrganizationResponse) => void;
  id?: string;
}

export interface SocialMediaFormValues {
  platform: LabelValue | null;
  username: string;
}

export interface UmkmFormValues {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  socialMedias: SocialMediaFormValues[];
  file: File;
}
