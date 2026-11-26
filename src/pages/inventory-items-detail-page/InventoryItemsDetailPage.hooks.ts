import { useInventoryLotsQuery } from "@/services/inventory-lots/inventoryLots.query";
import { ColumnSort } from "@/types/table";
import { InventoryLotResponse } from "@/types/inventoryLot";
import { apiErrorHandler } from "@/utils/api";
import { formatLocalDate, formatLocalDateOnly } from "@/utils/dateTime";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInventoryItemByIdQuery } from "@/services/inventory-items/inventoryItems.query";
import { inventoryLotsDefaultParameter } from "./InventoryItemsDetailPage.constants";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { currencyFormatter } from "@/utils/currency";

export default function useInventoryItemsDetailPage(inventoryItemId: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(
    searchParams.get("page") ?? inventoryLotsDefaultParameter.page,
  );
  const size = Number(
    searchParams.get("size") ?? inventoryLotsDefaultParameter.size,
  );
  const sortBy =
    searchParams.get("sortBy") ?? inventoryLotsDefaultParameter.sortBy;
  const search = searchParams.get("search") ?? undefined;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    if (!searchParams.has("page")) {
      params.set("page", String(inventoryLotsDefaultParameter.page));
      changed = true;
    }
    if (!searchParams.has("size")) {
      params.set("size", String(inventoryLotsDefaultParameter.size));
      changed = true;
    }
    if (!searchParams.has("sortBy")) {
      params.set("sortBy", inventoryLotsDefaultParameter.sortBy);
      changed = true;
    }

    if (changed) setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const { data, isLoading, isError, error, refetch } = useInventoryLotsQuery({
    inventoryItemId,
    page,
    size,
    sortBy,
    search,
    startDate: startDate?.length ? startDate : undefined,
    endDate: endDate?.length ? endDate : undefined,
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
      prev.set("page", String(inventoryLotsDefaultParameter.page));
      return prev;
    });

  const setStartDate = (value: string | undefined) =>
    setSearchParams((prev) => {
      if (value) prev.set("startDate", value);
      else prev.delete("startDate");
      prev.set("page", String(inventoryLotsDefaultParameter.page));
      return prev;
    });

  const setEndDate = (value: string | undefined) =>
    setSearchParams((prev) => {
      if (value) prev.set("endDate", value);
      else prev.delete("endDate");
      prev.set("page", String(inventoryLotsDefaultParameter.page));
      return prev;
    });

  const handleResetFilter = () =>
    setSearchParams((prev) => {
      prev.delete("search");
      prev.set("page", String(inventoryLotsDefaultParameter.page));
      return prev;
    });

  const handleChangeSort = ({ id, direction }: ColumnSort) =>
    setSearchParams((prev) => {
      prev.set("sortBy", `${direction === "desc" ? "-" : ""}${id}`);
      return prev;
    });

  const columns: MRT_ColumnDef<InventoryLotResponse>[] = useMemo(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Nomor Invoice",
        size: 180,
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue<string | null>() ?? "-",
      },
      {
        accessorKey: "supplierName",
        header: "Nama Supplier / Production",
        size: 200,
        enableSorting: false,
        Cell: ({ cell, row }) =>
          cell.getValue<string | null>() ?? row.original.preparationName ?? "-",
      },
      {
        accessorKey: "quantity",
        header: "Jumlah Stok",
        size: 170,
        Cell: ({ cell }) =>
          `${cell.getValue<number>().toLocaleString("id-ID")} (${inventoryUnitLabels[inventoryItemQuery?.data?.unit ?? "PCS"]})`,
      },
      {
        accessorKey: "remainingQuantity",
        header: "Sisa Stok",
        size: 140,
        Cell: ({ cell }) =>
          `${cell.getValue<number>().toLocaleString("id-ID")} (${inventoryUnitLabels[inventoryItemQuery?.data?.unit ?? "PCS"]})`,
      },
      {
        accessorKey: "unitCost",
        header: "Harga Per Stok",
        size: 160,
        Cell: ({ cell }) => currencyFormatter.format(cell.getValue<number>()),
      },
      {
        accessorKey: "totalCost",
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
    [inventoryItemQuery?.data],
  );

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  useEffect(() => {
    if (inventoryItemQuery.isError && inventoryItemQuery.error) {
      apiErrorHandler(inventoryItemQuery.error);
    }
  }, [inventoryItemQuery.isError, inventoryItemQuery.error]);

  const [editingLot, setEditingLot] = useState<InventoryLotResponse>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleClickEditForm = (lot: InventoryLotResponse) => {
    setEditingLot(lot);
    setIsFormOpen(true);
  };

  return {
    columns,
    data,
    editingLot,
    inventoryItemQuery,
    isError,
    refetch,
    isFormOpen,
    isLoading,
    endDate,
    search: search ?? "",
    sortBy,
    startDate,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickEditForm,
    handleResetFilter,
    setEndDate,
    setIsFormOpen,
    setStartDate,
  };
}
