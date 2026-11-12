import {
  orderStatusColorMapping,
  orderStatusMapping,
  orderTypeLabels,
} from "@/constants/order";
import { defaultParameter, defaultParameterDate } from "@/constants/table";
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
  } = useOrderQuery({
    page,
    size,
    sortBy,
    search,
    endDate: endDate?.length ? endDate : undefined,
    startDate: startDate?.length ? startDate : undefined,
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
      prev.set("startDate", defaultParameterDate);
      prev.set("endDate", defaultParameterDate);
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
      { accessorKey: "totalQuantity", header: "Jumlah Barang", size: 140 },
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
    isFormOpen,
    isLoading,
    isPrinting,
    markPaidOrder,
    search: search ?? "",
    sortBy,
    startDate,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
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
