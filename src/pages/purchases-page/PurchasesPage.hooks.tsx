import { currencyFormatter } from "@/constants/currency";
import { defaultParameter } from "@/constants/table";
import { useDeletePurchaseMutation } from "@/services/purchases/purchases.mutation";
import { usePurchasesQuery } from "@/services/purchases/purchases.query";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import { PurchaseResponse } from "@/types/purchase";
import { ColumnSort, PaginatedData } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { formatLocalDate, formatLocalDateOnly } from "@/utils/dateTime";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function usePurchasesPage() {
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

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = usePurchasesQuery({
    page,
    size,
    sortBy,
    search,
  });
  const data = response as PaginatedData<PurchaseResponse> | undefined;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchaseId, setEditingPurchaseId] = useState<string>();

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
    setEditingPurchaseId(undefined);
    setIsFormOpen(true);
  };

  const handleClickEditForm = (id: string) => {
    setEditingPurchaseId(id);
    setIsFormOpen(true);
  };

  const columns: MRT_ColumnDef<PurchaseResponse>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      { accessorKey: "supplierName", header: "Supplier", size: 200 },
      { accessorKey: "invoiceNumber", header: "Nomor Invoice", size: 180 },
      {
        accessorKey: "purchasedAt",
        header: "Tanggal Pembelian",
        size: 180,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return value ? formatLocalDateOnly(value) : "-";
        },
      },
      {
        id: "itemCount",
        header: "Jumlah Barang",
        size: 140,
        enableSorting: false,
        accessorFn: (row) => row.purchaseItems?.length ?? 0,
      },
      {
        id: "purchaseItems",
        header: "Total Pembelian",
        size: 180,
        enableSorting: false,
        Cell: ({ row }) => {
          const purchaseItems = row.original.purchaseItems;
          const totalCost = purchaseItems.reduce(
            (total, item) => total + Number(item.totalCost),
            0,
          );
          return currencyFormatter.format(totalCost);
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

  const deletePurchase = useDeletePurchaseMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  const handleClickDelete = async (id: string) => {
    if (
      !(await confirm({
        title: "Hapus Pembelian",
        message: "Apakah Anda yakin ingin menghapus transaksi pembelian ini?",
      }))
    ) {
      return;
    }

    const toastId = toast.loading("Menghapus pembelian...");
    try {
      await deletePurchase.mutateAsync(id);
      toast.success("Pembelian berhasil dihapus");
    } catch (deleteError) {
      apiErrorHandler(deleteError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    columns,
    data,
    editingPurchaseId,
    isFormOpen,
    isLoading,
    isError,
    search: search ?? "",
    sortBy,
    deletePurchase,
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
