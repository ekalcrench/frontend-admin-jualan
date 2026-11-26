import { defaultParameter } from "@/constants/table";
import CustomAutocomplete from "@/components/custom-autocomplete";
import {
  useActivateUserMutation,
  useEditUserMutation,
  useSuspendUserMutation,
} from "@/services/users/users.mutation";
import { useUsersQuery } from "@/services/users/users.query";
import useConfirmationStore from "@/store/confirmation-store";
import { User, UserRole, UserStatus } from "@/types/user";
import { ColumnSort } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { formatLocalDate } from "@/utils/dateTime";
import { Chip } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  userRole,
  userRoleMapping,
  userStatus,
  userStatusColorMapping,
  userStatusLabels,
} from "@/constants/user";

export default function useAllUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? defaultParameter.page);
  const size = Number(searchParams.get("size") ?? defaultParameter.size);
  const sortBy = searchParams.get("sortBy") ?? defaultParameter.sortBy;
  const search = searchParams.get("search") ?? undefined;
  const roleParam = searchParams.get("role");
  const role = Object.values(userRole).find((value) => value === roleParam);
  const statusParam = searchParams.get("status");
  const status = Object.values(userStatus).find(
    (value) => value === statusParam,
  );

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

  const { data, isLoading, isError, error, refetch } = useUsersQuery({
    page,
    size,
    sortBy,
    search,
    role,
    status,
  });

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const { control, getValues, reset } = useForm<{ role: UserRole }>();

  const suspendUser = useSuspendUserMutation();
  const activateUser = useActivateUserMutation();
  const editUser = useEditUserMutation();
  const confirm = useConfirmationStore((state) => state.confirm);

  const handleChangePage = (value: number) =>
    setSearchParams((prev) => {
      prev.set("page", `${value}`);
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
      prev.delete("role");
      prev.delete("status");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleChangeRoleFilter = (value?: UserRole) =>
    setSearchParams((prev) => {
      if (value) prev.set("role", value);
      else prev.delete("role");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleChangeStatusFilter = (value?: UserStatus) =>
    setSearchParams((prev) => {
      if (value) prev.set("status", value);
      else prev.delete("status");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleChangeSort = ({ id, direction }: ColumnSort) =>
    setSearchParams((prev) => {
      prev.set("sortBy", `${direction === "desc" ? "-" : ""}${id}`);
      return prev;
    });

  const handleClickChangeRole = (id: string, role: UserRole) => {
    setEditingRoleId(id);
    reset({ role });
  };

  const onSaveChangeRole = async (id: string, role: UserRole) => {
    if (
      !(await confirm({
        title: "Mengganti Role User",
        message: "Apakah Anda yakin ingin mengganti role user ini?",
      }))
    )
      return;
    const toastId = toast.loading("Sedang mengganti...");
    try {
      await editUser.mutateAsync({ id, role });
      setEditingRoleId(null);
      toast.success("Berhasil Mengganti Role");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const columns: MRT_ColumnDef<User>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Nama", size: 200 },
      {
        accessorKey: "email",
        header: "Email",
        grow: true,
        minSize: 160,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 150,
        Cell: ({ cell, row }) =>
          editingRoleId === row.original.id ? (
            <CustomAutocomplete
              name="role"
              control={control}
              placeholder="Pilih role"
              autocompleteProps={{
                options: Object.values(userRole),
                disableClearable: true,
              }}
              textFieldProps={{ sx: { minWidth: "180px" } }}
              size="small"
            />
          ) : (
            <Chip
              label={userRoleMapping[cell.getValue<UserRole>()]}
              size="small"
            />
          ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => (
          <Chip
            label={userStatusLabels[cell.getValue<UserStatus>()]}
            size="small"
            color={userStatusColorMapping[cell.getValue<UserStatus>()]}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 160,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 160,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
    ],
    [control, editingRoleId, editUser.isPending, editUser.variables, getValues],
  );

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  const handleClickSuspend = async (id: string) => {
    if (
      !(await confirm({
        title: "Suspend User",
        message: "Apakah Anda yakin ingin memblokir user ini?",
      }))
    )
      return;
    const toastId = toast.loading("Sedang memblokir...");
    try {
      await suspendUser.mutateAsync(id);
      toast.success("Berhasil Memblokir");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleClickActivate = async (id: string) => {
    if (
      !(await confirm({
        title: "Activate User",
        message: "Apakah Anda yakin ingin mengaktifkan user ini?",
      }))
    )
      return;
    const toastId = toast.loading("Sedang mengaktifkan...");
    try {
      await activateUser.mutateAsync(id);
      toast.success("Berhasil Mengaktifkan");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return {
    activateUser,
    columns,
    control,
    data,
    editingRoleId,
    editUser,
    isLoading,
    isError,
    refetch,
    search: search ?? "",
    role,
    sortBy,
    status,
    suspendUser,
    getValues,
    handleChangePage,
    handleChangeRoleFilter,
    handleChangeSearch,
    handleChangeSort,
    handleChangeStatusFilter,
    handleClickActivate,
    handleClickChangeRole,
    handleClickSuspend,
    handleResetFilter,
    onSaveChangeRole,
    setEditingRoleId,
  };
}
