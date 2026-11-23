import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { MRT_ColumnDef } from "material-react-table";
import { Chip, Stack, Typography, Box } from "@mui/material";
import {
  useDeleteProductModifierGroupMutation,
  useSetProductModifierGroupActiveMutation,
} from "@/services/product-modifiers/productModifiers.mutation";
import { useProductModifierGroupsQuery } from "@/services/product-modifiers/productModifiers.query";
import useConfirmationStore from "@/store/confirmation-store";
import type { ProductModifierGroupResponse } from "@/types/productModifier";
import type { ColumnSort } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { numberFormat } from "@/utils/number";
import {
  formatSelectionMode,
  formatSelectionRule,
} from "@/utils/productModifier";
import { modifierGroupsDefaultParameter } from "./ProductModifiersPage.constants";
import { BoxFlex } from "@/styled/CustomBox";

export default function useProductModifiersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(
    searchParams.get("page") ?? modifierGroupsDefaultParameter.page,
  );
  const size = Number(
    searchParams.get("size") ?? modifierGroupsDefaultParameter.size,
  );
  const sortBy =
    searchParams.get("sortBy") ?? modifierGroupsDefaultParameter.sortBy;
  const search = searchParams.get("search") ?? undefined;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    if (!searchParams.has("page")) {
      params.set("page", String(modifierGroupsDefaultParameter.page));
      changed = true;
    }
    if (!searchParams.has("size")) {
      params.set("size", String(modifierGroupsDefaultParameter.size));
      changed = true;
    }
    if (!searchParams.has("sortBy")) {
      params.set("sortBy", modifierGroupsDefaultParameter.sortBy);
      changed = true;
    }

    if (changed) setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useProductModifierGroupsQuery({ page, size, sortBy, search });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] =
    useState<ProductModifierGroupResponse>();

  const setActive = useSetProductModifierGroupActiveMutation();
  const deleteGroup = useDeleteProductModifierGroupMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  const handleChangePage = (value: number) =>
    setSearchParams((prev) => {
      prev.set("page", String(value));
      return prev;
    });

  const handleChangeSearch = (value: string) =>
    setSearchParams((prev) => {
      if (value.trim()) prev.set("search", value);
      else prev.delete("search");
      prev.set("page", String(modifierGroupsDefaultParameter.page));
      return prev;
    });

  const handleResetFilter = () =>
    setSearchParams((prev) => {
      prev.delete("search");
      prev.set("page", String(modifierGroupsDefaultParameter.page));
      prev.set("sortBy", modifierGroupsDefaultParameter.sortBy);
      return prev;
    });

  const handleChangeSort = ({ id, direction }: ColumnSort) =>
    setSearchParams((prev) => {
      prev.set("sortBy", `${direction === "desc" ? "-" : ""}${id}`);
      return prev;
    });

  const handleClickAddForm = () => {
    setEditingGroup(undefined);
    setIsFormOpen(true);
  };

  const handleClickEditForm = (group: ProductModifierGroupResponse) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleClickDelete = async (group: ProductModifierGroupResponse) => {
    const confirmed = await confirm({
      title: "Hapus Grup Variasi",
      message:
        group.assignedProductsCount > 0
          ? `Grup "${group.name}" masih digunakan oleh ${numberFormat.format(group.assignedProductsCount)} produk. Grup ini akan dinonaktifkan, bukan dihapus. Lanjutkan?`
          : `Apakah Anda yakin ingin menghapus grup variasi "${group.name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Ya, lanjutkan",
      cancelText: "Batal",
    });

    if (!confirmed) return;

    const toastId = toast.loading("Menghapus grup variasi...");
    try {
      await deleteGroup.mutateAsync(group.id);
      toast.success(
        group.assignedProductsCount > 0
          ? "Grup variasi dinonaktifkan karena masih digunakan oleh produk"
          : "Grup variasi berhasil dihapus",
      );
    } catch (deleteError) {
      apiErrorHandler(deleteError);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleClickToggleActive = async (
    group: ProductModifierGroupResponse,
  ) => {
    if (group.isActive) {
      const confirmed = await confirm({
        title: "Nonaktifkan Grup Variasi",
        message: `Grup "${group.name}" tidak akan muncul saat pelanggan memesan produk. Produk yang sudah menggunakan grup ini tetap menyimpan penugasannya. Lanjutkan?`,
        confirmText: "Nonaktifkan",
        cancelText: "Batal",
      });

      if (!confirmed) return;
    }

    try {
      await setActive.mutateAsync({
        id: group.id,
        isActive: !group.isActive,
      });
      toast.success(
        group.isActive
          ? "Grup variasi berhasil dinonaktifkan"
          : "Grup variasi berhasil diaktifkan",
      );
    } catch (toggleError) {
      apiErrorHandler(toggleError);
    }
  };

  const columns: MRT_ColumnDef<ProductModifierGroupResponse>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nama Grup",
        size: 220,
        Cell: ({ row }) => (
          <Box sx={{ paddingY: "4px" }}>
            <Typography sx={{ fontWeight: 600 }}>
              {row.original.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 280,
              }}
            >
              {row.original.description || "Tanpa deskripsi"}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "sortOrder",
        header: "Urutan",
        size: 90,
        enableSorting: true,
      },
      {
        accessorKey: "optionsCount",
        header: "Jumlah Opsi",
        size: 110,
        enableSorting: false,
        Cell: ({ cell }) =>
          `${numberFormat.format(cell.getValue<number>())} opsi`,
      },
      {
        accessorKey: "assignedProductsCount",
        header: "Produk Terhubung",
        size: 140,
        enableSorting: false,
        Cell: ({ cell }) =>
          `${numberFormat.format(cell.getValue<number>())} produk`,
      },
      {
        id: "selectionRules",
        header: "Aturan Pilihan",
        size: 230,
        enableSorting: false,
        Cell: ({ row }) => (
          <BoxFlex sx={{ flexWrap: "wrap", gap: "4px" }}>
            <Chip
              label={formatSelectionMode(row.original.isRequired)}
              size="small"
              variant="outlined"
              color={row.original.isRequired ? "primary" : "default"}
            />
            <Chip
              label={formatSelectionRule(row.original)}
              size="small"
              variant="outlined"
            />
          </BoxFlex>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        size: 100,
        Cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? "Aktif" : "Nonaktif"}
            size="small"
            color={row.original.isActive ? "success" : "default"}
            variant={row.original.isActive ? "filled" : "outlined"}
          />
        ),
      },
    ],
    [],
  );

  return {
    columns,
    data,
    deleteGroup,
    editingGroup,
    isFormOpen,
    isLoading,
    isFetching,
    isError,
    refetch,
    search: search ?? "",
    setActive,
    sortBy,
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
