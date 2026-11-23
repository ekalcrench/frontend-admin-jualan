import { ReactNode } from "react";

export interface PageTitleProps {
  title: string | ReactNode;
  subTitle: string;
  enableBackButton?: boolean;
  addButton?: ReactNode;
}
