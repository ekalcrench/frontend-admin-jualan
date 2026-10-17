import { orderStatusColorMapping, orderStatusMapping } from "@/constants/order";
import { defaultParameter } from "@/constants/table";
import {
  useDeleteOrderMutation,
  useMarkPaidOrderMutation,
} from "@/services/orders/orders.mutation";
import { useOrderQuery } from "@/services/orders/orders.query";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import type { OrderResponse, OrderStatus } from "@/types/order";
import type { ColumnSort, PaginatedData } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { currencyFormatter } from "@/utils/currency";
import { formatLocalDate } from "@/utils/dateTime";
import { Chip } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function useSalesPage() {
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
  } = useOrderQuery({ page, size, sortBy, search });
  const data = response as PaginatedData<OrderResponse> | undefined;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string>();

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
    setEditingOrderId(undefined);
    setIsFormOpen(true);
  };

  const handleClickEditForm = (id: string) => {
    setEditingOrderId(id);
    setIsFormOpen(true);
  };

  const columns: MRT_ColumnDef<OrderResponse>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      {
        accessorKey: "status",
        header: "Status",
        size: 140,
        Cell: ({ cell }) => (
          <Chip
            label={orderStatusMapping[cell.getValue<OrderStatus>()]}
            size="small"
            color={orderStatusColorMapping[cell.getValue<OrderStatus>()]}
          />
        ),
      },
      { accessorKey: "orderNumber", header: "Nomor Penjualan", size: 200 },
      {
        accessorKey: "totalAmount",
        header: "Total Penjualan",
        size: 180,
        Cell: ({ cell }) =>
          currencyFormatter.format(Number(cell.getValue<number>())),
      },
      {
        id: "itemCount",
        header: "Jumlah Produk",
        size: 140,
        enableSorting: false,
        accessorFn: (row) => row.orderItems?.length ?? 0,
      },
      {
        accessorKey: "createdAt",
        header: "Tanggal Penjualan",
        size: 180,
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

  const deleteOrder = useDeleteOrderMutation();
  const markPaidOrder = useMarkPaidOrderMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  const handleClickDelete = async (id: string) => {
    if (
      !(await confirm({
        title: "Hapus Penjualan",
        message: "Apakah Anda yakin ingin menghapus transaksi penjualan ini?",
      }))
    ) {
      return;
    }

    const toastId = toast.loading("Menghapus penjualan...");
    try {
      await deleteOrder.mutateAsync(id);
      toast.success("Penjualan berhasil dihapus");
    } catch (deleteError) {
      apiErrorHandler(deleteError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleClickMarkPaid = async (id: string) => {
    if (
      !(await confirm({
        title: "Ganti Menjadi Dibayar?",
        message:
          "Pesanan yang sudah diganti menjadi Dibayar tidak dapat diubah atau dihapus lagi, apakah Anda yakin?",
      }))
    ) {
      return;
    }

    const toastId = toast.loading("Mengubah status pembelian...");
    try {
      await markPaidOrder.mutateAsync(id);
      toast.success("Pesanan berhasil diubah statusnya");
    } catch (markPaidError) {
      apiErrorHandler(markPaidError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    columns,
    data,
    deleteOrder,
    editingOrderId,
    isFormOpen,
    isLoading,
    isError,
    markPaidOrder,
    search: search ?? "",
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleClickMarkPaid,
    handleResetFilter,
    setIsFormOpen,
  };
}
