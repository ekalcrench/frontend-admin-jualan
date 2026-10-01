import { SwipeableDrawerProps } from "@mui/material";
import { Dispatch } from "react";
import { LabelValue } from "@/types/generalTypes";
import { UserOrganizationDetail, UserOrganizationRole } from "@/types/user";

export interface UserFormProps extends SwipeableDrawerProps {
  setIsFormOpen: Dispatch<boolean>;
  onSuccess?: (organization: UserOrganizationDetail) => void;
}

export interface UserFormValues {
  userId: LabelValue<string>;
  role: LabelValue<UserOrganizationRole>;
}
