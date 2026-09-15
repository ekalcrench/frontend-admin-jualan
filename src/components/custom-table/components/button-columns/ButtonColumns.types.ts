import { MRT_RowData, MRT_ColumnDef } from "material-react-table";
import { Dispatch, SetStateAction } from "react";

export interface ButtonColumnsProps<TData extends MRT_RowData> {
  columns: MRT_ColumnDef<TData>[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: Dispatch<SetStateAction<Record<string, boolean>>>;
}
