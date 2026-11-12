import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";
import { LabelValue } from "@/types/generalTypes";
import {
  OrganizationUserResponse,
  OrganizationUserRole,
} from "@/types/organizationUser";

export interface UserFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  onSuccess?: (organization: OrganizationUserResponse) => void;
}

export interface UserFormValues {
  userId: LabelValue<string>;
  role: LabelValue<OrganizationUserRole>;
}
