import { Chip } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { defaultParameter } from "@/constants/table";
import {
  useCompletePreparationMutation,
  useDeletePreparationMutation,
} from "@/services/preparations/preparations.mutation";
import { usePreparationQuery } from "@/services/preparations/preparations.query";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import { inventoryUnitLabels } from "@/constants/inventoryItem";
import { PreparationResponse } from "@/types/preparations";
import { ColumnSort } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { currencyFormatter } from "@/utils/currency";
import { formatLocalDate, formatLocalDateOnly } from "@/utils/dateTime";
import { toast } from "sonner";

export default function useInventoryProductionsPage() {
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
  } = usePreparationQuery({ page, size, sortBy, search });
  const data = response;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPreparationId, setEditingPreparationId] = useState<string>();

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
    setEditingPreparationId(undefined);
    setIsFormOpen(true);
  };

  const handleClickEditForm = (id: string) => {
    setEditingPreparationId(id);
    setIsFormOpen(true);
  };

  const columns: MRT_ColumnDef<PreparationResponse>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      {
        accessorKey: "status",
        header: "Status",
        size: 130,
        Cell: ({ cell }) => {
          const status = cell.getValue<PreparationResponse["status"]>();
          return (
            <Chip
              label={status === "COMPLETED" ? "Selesai" : "Draft"}
              size="small"
              color={status === "COMPLETED" ? "success" : "warning"}
            />
          );
        },
      },
      { accessorKey: "name", header: "Nama Produksi", size: 190 },
      {
        accessorFn: (row) => row.outputInventoryItem.name,
        id: "outputInventoryItem",
        header: "Barang Hasil",
        size: 200,
      },
      {
        accessorKey: "outputQuantity",
        header: "Jumlah Hasil",
        size: 140,
        Cell: ({ cell, row }) =>
          `${Number(cell.getValue<number>()).toLocaleString("id-ID")} ${inventoryUnitLabels[row.original.outputInventoryItem.unit]}`,
      },
      {
        accessorKey: "preparedAt",
        header: "Tanggal Produksi",
        size: 180,
        Cell: ({ cell }) => formatLocalDateOnly(cell.getValue<string>()),
      },
      {
        accessorKey: "outputTotalCost",
        header: "Total Biaya",
        size: 160,
        Cell: ({ cell }) => currencyFormatter.format(cell.getValue<number>()),
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

  const deletePreparation = useDeletePreparationMutation();
  const completePreparation = useCompletePreparationMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  const handleClickDelete = async (preparation: PreparationResponse) => {
    if (
      !(await confirm({
        title: "Hapus Produksi",
        message: `Apakah Anda yakin ingin menghapus produksi "${preparation.name ?? preparation.id}"?`,
      }))
    ) {
      return;
    }

    const toastId = toast.loading("Menghapus produksi...");
    try {
      await deletePreparation.mutateAsync(preparation.id);
      toast.success("Produksi berhasil dihapus");
    } catch (deleteError) {
      apiErrorHandler(deleteError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleClickComplete = async (id: string) => {
    if (
      !(await confirm({
        title: "Production Selesai",
        message:
          "Production yang sudah selesai tidak dapat diubah atau dihapus, apakah Anda yakin?",
      }))
    ) {
      return;
    }

    const toastId = toast.loading("Menselesaikan production...");
    try {
      await completePreparation.mutateAsync(id);
      toast.success("Production selesai");
    } catch (finalizeError) {
      apiErrorHandler(finalizeError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    columns,
    completePreparation,
    data,
    deletePreparation,
    editingPreparationId,
    isFormOpen,
    isLoading,
    isError,
    search: search ?? "",
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickComplete,
    handleClickDelete,
    handleClickEditForm,
    handleResetFilter,
    setIsFormOpen,
  };
}
