import { defaultParameter } from "@/constants/table";
import {
  cashTransactionTypeColorMapping,
  cashTransactionTypeLabels,
  isEditableCashTransactionType,
} from "@/constants/cashTransaction";
import { useDeleteCashTransactionMutation } from "@/services/cash-transactions/cashTransactions.mutation";
import {
  useCashTransactionBalanceQuery,
  useCashTransactionsQuery,
} from "@/services/cash-transactions/cashTransactions.query";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import { CashTransactionResponse } from "@/types/cashTransaction";
import { ColumnSort } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { currencyFormatter } from "@/utils/currency";
import { formatLocalDate } from "@/utils/dateTime";
import { Chip } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import useCashTransactionStore from "@/store/cash-transaction-store";

const defaultCashFlowSort = "-transactionAt";

export default function useCashFlowsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? defaultParameter.page);
  const size = Number(searchParams.get("size") ?? defaultParameter.size);
  const sortBy = searchParams.get("sortBy") ?? defaultCashFlowSort;
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
      params.set("sortBy", defaultCashFlowSort);
      changed = true;
    }

    if (changed) setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const { endDate, startDate } = useCashTransactionStore();

  const { data, isLoading, isError, error } = useCashTransactionsQuery({
    page,
    size,
    sortBy,
    search,
    endDate: endDate.length ? endDate : undefined,
    startDate: startDate.length ? startDate : undefined,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCashTransactionId, setEditingCashTransactionId] =
    useState<string>();

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

  const handleClickAddForm = () => {
    setEditingCashTransactionId(undefined);
    setIsFormOpen(true);
  };

  const handleClickEditForm = (id: string) => {
    setEditingCashTransactionId(id);
    setIsFormOpen(true);
  };

  const columns: MRT_ColumnDef<CashTransactionResponse>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      {
        accessorKey: "type",
        header: "Jenis Transaksi",
        size: 180,
        Cell: ({ cell }) => {
          const type = cell.getValue<CashTransactionResponse["type"]>();
          return (
            <Chip
              label={cashTransactionTypeLabels[type]}
              size="small"
              color={cashTransactionTypeColorMapping[type]}
            />
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Jumlah",
        size: 180,
        Cell: ({ cell }) => currencyFormatter.format(cell.getValue<number>()),
      },
      {
        accessorKey: "transactionAt",
        header: "Tanggal Transaksi",
        size: 180,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
        size: 260,
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue<string | null>() || "-",
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

  const deleteCashTransaction = useDeleteCashTransactionMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  const handleClickDelete = async (transaction: CashTransactionResponse) => {
    if (!isEditableCashTransactionType(transaction.type)) {
      toast.error("Transaksi ini tidak dapat dihapus");
      return;
    }

    if (
      !(await confirm({
        title: "Hapus Arus Kas",
        message: "Apakah Anda yakin ingin menghapus transaksi arus kas ini?",
      }))
    ) {
      return;
    }

    const toastId = toast.loading("Menghapus arus kas...");
    try {
      await deleteCashTransaction.mutateAsync(transaction.id);
      toast.success("Arus kas berhasil dihapus");
    } catch (deleteError) {
      apiErrorHandler(deleteError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    columns,
    data,
    deleteCashTransaction,
    editingCashTransactionId,
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
