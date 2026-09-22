import { Dispatch, SetStateAction } from "react";
import { MRT_ColumnDef, MRT_RowData } from "material-react-table";
import { CustomSearchInputProps } from "../custom-search-input/CustomSearchInput.types";

export interface CustomTopToolbarProps<
  TData extends MRT_RowData,
> extends Partial<CustomSearchInputProps> {
  // Search
  search: string;
  handleSearch: (value: string) => void;

  // Filters (Optional)
  handleClickFilters?: () => void;

  // Reset
  handleResetFilter: () => void;

  // Columns
  columns: MRT_ColumnDef<TData>[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: Dispatch<SetStateAction<Record<string, boolean>>>;

  // Add Button (Optional)
  addButton?: React.ReactNode;
}
