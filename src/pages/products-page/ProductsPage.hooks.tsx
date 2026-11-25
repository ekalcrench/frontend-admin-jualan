import { defaultParameter } from "@/constants/table";
import {
  useDeleteProductMutation,
  useEditProductMutation,
} from "@/services/products/products.mutation";
import { useProductQuery } from "@/services/products/products.query";
import useConfirmationStore from "@/store/confirmation-store/confirmationStore";
import type { ProductResponse } from "@/types/product";
import type { ColumnSort, PaginatedData } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { currencyFormatter } from "@/utils/currency";
import { calculateProductCapitalCost } from "@/utils/product";
import { formatLocalDate } from "@/utils/dateTime";
import { Chip } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { numberFormat } from "@/utils/number";
import AllInclusiveRoundedIcon from "@mui/icons-material/AllInclusiveRounded";

export default function useProductsPage() {
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
    refetch,
  } = useProductQuery({ page, size, sortBy, search });
  const data = response as PaginatedData<ProductResponse> | undefined;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string>();

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
    setEditingProductId(undefined);
    setIsFormOpen(true);
  };

  const handleClickEditForm = (id: string) => {
    setEditingProductId(id);
    setIsFormOpen(true);
  };

  const columns: MRT_ColumnDef<ProductResponse>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Nama Produk", size: 240 },
      {
        accessorKey: "isActive",
        header: "Status",
        size: 110,
        Cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? "Aktif" : "Nonaktif"}
            size="small"
            color={row.original.isActive ? "success" : "default"}
            variant={row.original.isActive ? "filled" : "outlined"}
          />
        ),
      },
      {
        accessorKey: "capitalCost",
        header: "Harga Modal",
        size: 160,
        enableSorting: false,
        Cell: ({ row }) => {
          const capitalCost = calculateProductCapitalCost(
            row.original.productIngredients,
          );

          return capitalCost ? currencyFormatter.format(capitalCost) : "-";
        },
      },
      {
        accessorKey: "sellingPrice",
        header: "Harga Jual",
        size: 160,
        Cell: ({ cell }) =>
          currencyFormatter.format(Number(cell.getValue<number>())),
      },
      {
        accessorKey: "stock",
        header: "Jumlah Stok",
        size: 140,
        Cell: ({ cell, row }) =>
          row.original.stockManagement === "UNTRACKED" ? (
            <AllInclusiveRoundedIcon fontSize="small" />
          ) : (
            numberFormat.format(Number(cell.getValue<number>()))
          ),
      },
      {
        accessorKey: "ingredientCount",
        header: "Total Bahan",
        size: 140,
        enableSorting: false,
        Cell: ({ cell }) =>
          `${numberFormat.format(Number(cell.getValue<number>()))} bahan`,
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

  const deleteProduct = useDeleteProductMutation();
  const editProduct = useEditProductMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  const handleClickDelete = async (id: string) => {
    if (
      !(await confirm({
        title: "Hapus Produk",
        message: "Apakah Anda yakin ingin menghapus produk ini?",
      }))
    ) {
      return;
    }

    const toastId = toast.loading("Menghapus produk...");
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produk berhasil dihapus");
    } catch (deleteError) {
      apiErrorHandler(deleteError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleClickToggleActive = async (product: ProductResponse) => {
    if (product.isActive) {
      const confirmed = await confirm({
        title: "Nonaktifkan Produk",
        message: `Produk "${product.name}" tidak akan muncul saat membuat pesanan baru. Riwayat transaksi tetap tersedia. Lanjutkan?`,
        confirmText: "Nonaktifkan",
        cancelText: "Batal",
      });

      if (!confirmed) return;
    }

    try {
      await editProduct.mutateAsync({
        id: product.id,
        isActive: !product.isActive,
      });
      toast.success(
        product.isActive
          ? "Produk berhasil dinonaktifkan"
          : "Produk berhasil diaktifkan",
      );
    } catch (toggleError) {
      apiErrorHandler(toggleError);
    }
  };

  return {
    columns,
    data,
    editingProductId,
    isFormOpen,
    isLoading,
    isError,
    refetch,
    search: search ?? "",
    sortBy,
    deleteProduct,
    editProduct,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickAddForm,
    handleClickDelete,
    handleClickEditForm,
    handleClickToggleActive,
    handleResetFilter,
    setIsFormOpen,
  };
}
