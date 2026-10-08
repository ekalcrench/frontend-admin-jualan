import { currencyFormatter } from "@/constants/currency";
import { defaultParameter } from "@/constants/table";
import { useInventoryLotsQuery } from "@/services/inventory-lots/inventoryLots.query";
import { ColumnSort } from "@/types/table";
import { InventoryLotsResponse } from "@/types/inventoryLot";
import { apiErrorHandler } from "@/utils/api";
import { formatLocalDate, formatLocalDateOnly } from "@/utils/dateTime";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useInventoryItemByIdQuery } from "@/services/inventory-items/inventoryItems.query";

export default function useInventoryItemsDetailPage(inventoryItemId: string) {
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

  const { data, isLoading, isError, error } = useInventoryLotsQuery({
    inventoryItemId,
    page,
    size,
    sortBy,
    search,
  });
  const inventoryItemQuery = useInventoryItemByIdQuery(inventoryItemId);

  const handleChangePage = (value: number) =>
    setSearchParams((prev) => {
      prev.set("page", String(value));
      return prev;
    });

  const handleChangeSearch = (value: string) =>
    setSearchParams((prev) => {
      if (value.trim()) prev.set("search", value);
      else prev.delete("search");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleResetFilter = () =>
    setSearchParams((prev) => {
      prev.delete("search");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleChangeSort = ({ id, direction }: ColumnSort) =>
    setSearchParams((prev) => {
      prev.set("sortBy", `${direction === "desc" ? "-" : ""}${id}`);
      return prev;
    });

  const columns: MRT_ColumnDef<InventoryLotsResponse>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID Lot", size: 160, enableSorting: false },
      {
        accessorKey: "inventoryItemId",
        header: "ID Inventory",
        size: 160,
        enableSorting: false,
      },
      {
        accessorKey: "purchaseItemId",
        header: "ID Pembelian",
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: "invoiceNumber",
        header: "Nomor Invoice",
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: "quantity",
        header: "Jumlah Stok",
        size: 170,
        Cell: ({ cell }) => cell.getValue<number>().toLocaleString("id-ID"),
      },
      {
        accessorKey: "remainingQuantity",
        header: "Sisa Stok",
        size: 140,
        Cell: ({ cell }) => cell.getValue<number>().toLocaleString("id-ID"),
      },
      {
        accessorKey: "unitCost",
        header: "Total Biaya",
        size: 170,
        Cell: ({ cell }) => currencyFormatter.format(cell.getValue<number>()),
      },
      {
        accessorKey: "receivedAt",
        header: "Diterima Pada",
        size: 170,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
      {
        accessorKey: "expiredAt",
        header: "Tanggal Kedaluwarsa",
        size: 190,
        Cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>();
          return value ? formatLocalDateOnly(value) : "-";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Dibuat Pada",
        size: 160,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
      {
        accessorKey: "updatedAt",
        header: "Diubah Pada",
        size: 160,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
    ],
    [],
  );

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  useEffect(() => {
    if (inventoryItemQuery.isError && inventoryItemQuery.error) {
      apiErrorHandler(inventoryItemQuery.error);
    }
  }, [inventoryItemQuery.isError, inventoryItemQuery.error]);

  return {
    columns,
    data,
    inventoryItemQuery,
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
