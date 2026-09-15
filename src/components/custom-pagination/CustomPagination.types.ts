export interface CustomPaginationProps {
  isLoading: boolean;
  page: number;
  size: number;
  totalRows: number;
  totalDisplayedData: number;
  totalPages: number;
  handleChangePage(newPage: number): void;
}
