import { currencyFormatter } from "@/constants/currency";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { defaultParameter } from "@/constants/table";
import { useDeleteInventoryItemMutation } from "@/services/inventory-items/inventoryItems.mutation";
import { useInventoryItemsQuery } from "@/services/inventory-items/inventoryItems.query";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import { InventoryItemResponse, InventoryUnit } from "@/types/inventoryItem";
import { ColumnSort } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { formatLocalDate } from "@/utils/dateTime";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function useInventoryItemsPage() {
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

  const { data, isLoading, isError, error } = useInventoryItemsQuery({
    page,
    size,
    sortBy,
    search,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    InventoryItemResponse | undefined
  >();

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

  const handleClickAddForm = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleClickEditForm = (item: InventoryItemResponse) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const columns: MRT_ColumnDef<InventoryItemResponse>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      { accessorKey: "name", header: "Nama Barang", size: 220 },
      {
        accessorKey: "unit",
        header: "Satuan",
        size: 140,
        Cell: ({ cell }) => inventoryUnitLabels[cell.getValue<InventoryUnit>()],
      },
      {
        accessorKey: "totalStock",
        header: "Total Stok",
        size: 140,
        Cell: ({ cell, row }) =>
          `${cell.getValue<number>().toLocaleString("id-ID")} ${inventoryUnitLabels[row.original.unit]}`,
      },
      {
        accessorKey: "averageCost",
        header: "Rata-Rata Biaya",
        size: 180,
        Cell: ({ cell, row }) =>
          `${currencyFormatter.format(cell.getValue<number>())} / ${inventoryUnitLabels[row.original.unit]}`,
      },
      {
        accessorKey: "totalCost",
        header: "Total Biaya",
        size: 180,
        Cell: ({ row }) =>
          currencyFormatter.format(
            row.original.totalStock * row.original.averageCost,
          ),
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

  const deleteInventoryItem = useDeleteInventoryItemMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  const handleClickDelete = async (id: string) => {
    if (
      !(await confirm({
        title: "Hapus Barang",
        message: "Apakah Anda yakin ingin menghapus Barang ini?",
      }))
    )
      return;

    const toastId = toast.loading("Sedang mengahpus...");
    try {
      await deleteInventoryItem.mutateAsync(id);
      toast.success("Berhasil Menghapus");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    columns,
    data,
    editingItem,
    isFormOpen,
    isLoading,
    isError,
    search: search ?? "",
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleResetFilter,
    setIsFormOpen,
  };
}
