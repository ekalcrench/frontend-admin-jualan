import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
} from "material-react-table";
import { CustomPaginationProps } from "../custom-pagination/CustomPagination.types";
import { ColumnSort } from "@/types/table";
import { CustomTopToolbarProps } from "./components/custom-top-toolbar/CustomTopToolbar.types";

export interface CustomTableProps<TData extends MRT_RowData>
  extends
    Omit<
      MRT_TableOptions<TData>,
      | "columns"
      | "data"
      | "onSortingChange"
      | "renderEmptyRowsFallback"
      | "enableRowActions"
    >,
    Partial<CustomPaginationProps>,
    Omit<
      CustomTopToolbarProps<TData>,
      "columns" | "columnVisibility" | "setColumnVisibility"
    > {
  // Required
  data: TData[];
  columns: MRT_ColumnDef<TData>[];
  sortBy: ColumnSort;
  onSortChange(sortBy: ColumnSort): void;

  // Optional
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  filterComponents?: React.ReactNode;
  enableRowActions?: boolean;
  columnRowActionsSize?: number;
}
