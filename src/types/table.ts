export type SortDirection = "asc" | "desc";

export interface DefaultFilter {
  page: number;
  size: number;
  sortBy: string;
}

export interface PaginatedData<DataType> {
  items: DataType[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface ColumnSort {
  id: string;
  direction: SortDirection;
}
