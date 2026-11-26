import {
  orderStatusColorMapping,
  orderStatusLabels,
  orderTypeOptions,
  orderTypeLabels,
} from "@/constants/order";
import { defaultParameter } from "@/constants/table";
import { useThermalPrinter } from "@/hooks/useThermalPrinter";
import {
  useDeleteOrderMutation,
  useMarkPaidOrderMutation,
} from "@/services/orders/orders.mutation";
import { useOrderQuery } from "@/services/orders/orders.query";
import { useOrganizationByIdQuery } from "@/services/organizations/organizations.query";
import useAuthStore from "@/store/auth-store";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import { OrderResponse, OrderStatus, OrderType } from "@/types/order";
import { ColumnSort, PaginatedData } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { currencyFormatter } from "@/utils/currency";
import { formatLocalDate } from "@/utils/dateTime";
import { numberFormat } from "@/utils/number";
import { buildReceipt } from "@/utils/print";
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
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;
  const statusParam = searchParams.get("status");
  const status: OrderStatus | undefined =
    statusParam === "PAID" || statusParam === "UNPAID"
      ? statusParam
      : undefined;
  const typeParam = searchParams.get("type");
  const type = orderTypeOptions.find((option) => option === typeParam);

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
    refetch,
  } = useOrderQuery({
    page,
    size,
    sortBy,
    search,
    endDate: endDate?.length ? endDate : undefined,
    startDate: startDate?.length ? startDate : undefined,
    status,
    type,
  });
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
      prev.delete("status");
      prev.delete("type");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleChangeStatus = (value?: OrderStatus) =>
    setSearchParams((prev) => {
      if (value) prev.set("status", value);
      else prev.delete("status");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleChangeType = (value?: OrderType) =>
    setSearchParams((prev) => {
      if (value) prev.set("type", value);
      else prev.delete("type");
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

  const setStartDate = (value: string | undefined) => {
    setSearchParams((prev) => {
      if (value) prev.set("startDate", value);
      else prev.delete("startDate");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });
  };

  const setEndDate = (value: string | undefined) => {
    setSearchParams((prev) => {
      if (value) prev.set("endDate", value);
      else prev.delete("endDate");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });
  };

  const columns: MRT_ColumnDef<OrderResponse>[] = useMemo(
    () => [
      {
        accessorKey: "status",
        header: "Status",
        size: 140,
        Cell: ({ cell }) => (
          <Chip
            label={orderStatusLabels[cell.getValue<OrderStatus>()]}
            size="small"
            color={orderStatusColorMapping[cell.getValue<OrderStatus>()]}
          />
        ),
      },
      { accessorKey: "orderNumber", header: "Nomor Penjualan", size: 200 },
      {
        accessorKey: "type",
        header: "Jenis Pesanan",
        size: 160,
        Cell: ({ cell }) => orderTypeLabels[cell.getValue<OrderType>()],
      },
      {
        accessorKey: "totalAmount",
        header: "Total Penjualan",
        size: 180,
        Cell: ({ cell }) =>
          currencyFormatter.format(Number(cell.getValue<number>())),
      },
      {
        accessorKey: "totalQuantity",
        header: "Jumlah Produk",
        size: 140,
        Cell: ({ cell }) => numberFormat.format(cell.getValue<number>()),
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

  const organizationStore = useAuthStore((state) => state.organization);

  const organization = useOrganizationByIdQuery(organizationStore?.id);

  const { connectionStatus, isChecking, isPrinting, refreshPrinter, print } =
    useThermalPrinter();

  const handlePrint = async (order: OrderResponse) => {
    if (!organization.data)
      return toast.error("UMKM tidak ditemukan, silakan hubungi CS");

    const toastId = toast.loading("Mengubah status pembelian...");
    try {
      const result = await print(buildReceipt(order, organization.data), {
        paperWidth: 58,
        cut: true,
        reference: order.orderNumber,
      });

      toast.success(`Struk berhasil dicetak! Job ID: ${result.jobId}`);
    } catch (err) {
      apiErrorHandler(err);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    columns,
    connectionStatus,
    data,
    deleteOrder,
    editingOrderId,
    endDate,
    isChecking,
    isError,
    refetch,
    isFormOpen,
    isLoading,
    isPrinting,
    markPaidOrder,
    search: search ?? "",
    status,
    sortBy,
    startDate,
    type,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleChangeStatus,
    handleChangeType,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleClickMarkPaid,
    handlePrint,
    handleResetFilter,
    refreshPrinter,
    setEndDate,
    setIsFormOpen,
    setStartDate,
  };
}
