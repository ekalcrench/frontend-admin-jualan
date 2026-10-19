import { inventoryUnitLabels } from "@/constants/inventoryItem";
import {
  inventoryTransactionQuantity,
  inventoryTransactionTypeColors,
  inventoryTransactionTypeLabels,
} from "@/constants/inventoryTransaction";
import { defaultParameter } from "@/constants/table";
import { useInventoryTransactionsQuery } from "@/services/inventory-transactions/inventoryTransactions.query";
import type {
  InventoryTransactionResponse,
  InventoryTransactionType,
} from "@/types/inventoryTransaction";
import type { ColumnSort } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { formatLocalDate } from "@/utils/dateTime";
import { Chip } from "@mui/material";
import type { MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function useInventoryTransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? defaultParameter.page);
  const size = Number(searchParams.get("size") ?? defaultParameter.size);
  const sortBy = searchParams.get("sortBy") ?? defaultParameter.sortBy;
  const search = searchParams.get("search") ?? undefined;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    if (!searchParams.has("page")) {
      params.set("page", String(defaultParameter.page));
      changed = true;
    }
    if (!searchParams.has("size")) {
      params.set("size", String(defaultParameter.size));
      changed = true;
    }
    if (!searchParams.has("sortBy")) {
      params.set("sortBy", defaultParameter.sortBy);
      changed = true;
    }

    if (changed) setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const { data, isLoading, isError, error } = useInventoryTransactionsQuery({
    page,
    size,
    sortBy,
    search,
  });

  const handleChangePage = (value: number) =>
    setSearchParams((previous) => {
      previous.set("page", String(value));
      return previous;
    });

  const handleChangeSearch = (value: string) =>
    setSearchParams((previous) => {
      if (value.trim()) previous.set("search", value);
      else previous.delete("search");
      previous.set("page", String(defaultParameter.page));
      return previous;
    });

  const handleResetFilter = () =>
    setSearchParams((previous) => {
      previous.delete("search");
      previous.set("page", String(defaultParameter.page));
      return previous;
    });

  const handleChangeSort = ({ id, direction }: ColumnSort) =>
    setSearchParams((previous) => {
      previous.set("sortBy", `${direction === "desc" ? "-" : ""}${id}`);
      return previous;
    });

  const columns: MRT_ColumnDef<InventoryTransactionResponse>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      {
        id: "inventoryItemName",
        header: "Nama Barang",
        size: 220,
        enableSorting: false,
        accessorFn: (row) => row.inventoryItem.name,
      },
      {
        accessorKey: "type",
        header: "Jenis Transaksi",
        size: 190,
        Cell: ({ cell }) => {
          const type = cell.getValue<InventoryTransactionType>();
          return (
            <Chip
              label={inventoryTransactionTypeLabels[type]}
              color={inventoryTransactionTypeColors[type]}
              size="small"
            />
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Jumlah",
        size: 140,
        Cell: ({ cell, row }) =>
          inventoryTransactionQuantity(
            row.original.type,
            cell.getValue<number>(),
            row.original.inventoryItem.unit,
          ),
      },
      {
        accessorKey: "referenceId",
        header: "Referensi ID",
        size: 180,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: "Tanggal Transaksi",
        size: 180,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
    ],
    [],
  );

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  return {
    columns,
    data,
    isLoading,
    isError,
    search: search ?? "",
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleResetFilter,
  };
}
