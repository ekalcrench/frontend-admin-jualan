import { Dispatch, SetStateAction } from "react";

export interface ReportDateFormValues {
  startDate: string;
  endDate: string;
}

export type ReportDateType =
  | "TODAY"
  | "A_WEEK"
  | "A_MONTH"
  | "A_YEAR"
  | "CUSTOM"
  | undefined;

export interface ReportDateProps {
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
}
