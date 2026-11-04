import { DefaultFilter } from "@/types/table";
import { getCurrentDate } from "@/utils/dateTime";
import { SortDirection } from "@mui/material";

export const ascDirection: SortDirection = "asc";
export const descDirection: SortDirection = "desc";
export const defaultPage = 1;
export const defaultPageSize = 20;

export const defaultParameter: DefaultFilter = {
  page: 1,
  size: 20,
  sortBy: "-createdDate",
};

export const defaultParameterDate = getCurrentDate();
