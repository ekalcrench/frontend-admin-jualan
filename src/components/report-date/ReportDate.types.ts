export interface ReportDateFormValues {
  startDate: string;
  endDate: string;
}

export type ReportDateType =
  | "ALL_TIME"
  | "TODAY"
  | "A_WEEK"
  | "A_MONTH"
  | "A_YEAR"
  | "CUSTOM";

export interface ReportDateProps {
  startDate: string | undefined;
  endDate: string | undefined;
  setStartDate: (value: string | undefined) => void;
  setEndDate: (value: string | undefined) => void;
}
