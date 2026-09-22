import {
  MaterialReactTable,
  MRT_RowData,
  MRT_SortingState,
} from "material-react-table";
import { useState } from "react";
import { CustomTableProps } from "./CustomTable.types";
import CustomPagination from "../custom-pagination";
import { emptyFunc } from "@/utils/generalUtils";
import { defaultPage, defaultPageSize, descDirection } from "@/constants/table";
import { BoxCenter } from "@/styled/CustomBox";
import CustomTopToolbar from "./components/custom-top-toolbar";
import { Collapse, Stack } from "@mui/material";
import { boxShadowMain } from "@/constants/styled";

export default function CustomTable<TData extends MRT_RowData>({
  // Required
  data,
  columns,
  sortBy,
  onSortChange,

  // Optional
  isLoading = false,
  isError = false,
  errorMessage = "Terjadi kesalahan, mohon coba refresh kembali atau hubungi admin.",
  emptyMessage = "Data tidak ditemukan.",
  onRowSelectionChange,
  filterComponents,
  enableRowActions,
  columnRowActionsSize,

  // Custom Top Toolbar
  addButton,
  search,
  searchPlaceholder,
  handleResetFilter,
  handleSearch,

  // Custom Pagination Props
  page = defaultPage,
  size = defaultPageSize,
  totalRows = 0,
  totalPages = defaultPage,
  handleChangePage = emptyFunc,

  ...tableOptions
}: CustomTableProps<TData>) {
  const totalDisplayedData = data.length;

  // Sorting
  const sorting: MRT_SortingState = sortBy
    ? [{ id: sortBy.id, desc: sortBy.direction === descDirection }]
    : [];
  const onSort = (sort: MRT_SortingState) => {
    if (typeof onSortChange !== "function") return;

    if (sort.length === 0) {
      onSortChange({ id: "", direction: "asc" });
      return;
    }

    const newSort = sort[0];

    onSortChange({
      id: newSort.id,
      direction: newSort.desc ? "desc" : "asc",
    });
  };

  // Filters
  const hasFilters = filterComponents !== undefined;
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const handleClickFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Columns
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(
    tableOptions.state?.columnVisibility ??
      tableOptions.initialState?.columnVisibility ??
      {},
  );

  // Reset
  const handleReset = () => {
    setColumnVisibility(tableOptions.initialState?.columnVisibility ?? {});
    handleResetFilter();
  };

  return (
    <Stack spacing={3}>
      <CustomTopToolbar<TData>
        handleClickFilters={hasFilters ? handleClickFilters : undefined}
        handleResetFilter={handleReset}
        addButton={addButton}
        search={search}
        searchPlaceholder={searchPlaceholder}
        handleSearch={handleSearch}
        columns={columns}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      />

      {hasFilters && <Collapse in={showFilters}>{filterComponents}</Collapse>}

      <MaterialReactTable
        getRowId={(row) => row.id}
        {...tableOptions}
        localization={{
          ...tableOptions.localization,
          sortByColumnAsc: "",
          sortByColumnDesc: "",
          sortedByColumnAsc: "",
          sortedByColumnDesc: "",
        }}
        columns={columns}
        data={data}
        onSortingChange={(updaterOrValue) => {
          if (typeof updaterOrValue !== "function") return;

          onSort(updaterOrValue(sorting));
        }}
        initialState={{
          ...tableOptions.initialState,
          ...(enableRowActions && {
            columnPinning: {
              right: ["mrt-row-actions"],
            },
          }),
        }}
        state={{
          ...tableOptions.state,
          ...(sortBy
            ? {
                sorting: [
                  { id: sortBy.id, desc: sortBy.direction === descDirection },
                ],
              }
            : {}),
          ...(page !== undefined && size !== undefined
            ? {
                pagination: {
                  pageIndex: page,
                  pageSize: size,
                },
              }
            : {}),
          showLoadingOverlay: false,
          showSkeletons: isLoading,
          isLoading: isLoading,
          columnVisibility,
        }}
        enableRowActions={enableRowActions}
        enableBottomToolbar={false}
        enableColumnActions={false}
        enableColumnDragging={false}
        enableRowDragging={false}
        enableTableFooter={false}
        enableTopToolbar={false}
        enableSortingRemoval={false}
        enableColumnOrdering
        enableColumnResizing
        enableSorting
        manualFiltering
        manualPagination
        manualSorting
        displayColumnDefOptions={{
          ...(columnRowActionsSize && {
            "mrt-row-actions": {
              size: columnRowActionsSize,
              grow: false,
            },
          }),
        }}
        renderEmptyRowsFallback={() => (
          <BoxCenter sx={{ height: "100%", minHeight: "100px" }}>
            {isError ? errorMessage : emptyMessage}
          </BoxCenter>
        )}
        muiTablePaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: boxShadowMain,
          },
        }}
        muiTableHeadRowProps={{
          sx: {
            backgroundColor: "white",
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            backgroundColor: "white",
          },
        }}
        muiSkeletonProps={{ height: 24 }}
      />

      <CustomPagination
        handleChangePage={handleChangePage}
        page={page}
        size={size}
        totalRows={totalRows}
        totalDisplayedData={totalDisplayedData}
        totalPages={totalPages}
        isLoading={isLoading ?? false}
      />
    </Stack>
  );
}
