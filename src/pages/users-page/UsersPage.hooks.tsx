import { defaultParameter } from "@/constants/table";
import CustomAutocomplete from "@/components/custom-autocomplete";
import useConfirmationStore from "@/store/confirmation-store";
import {
  UserOrganization,
  UserOrganizationRole,
  UserOrganizationStatus,
} from "@/types/user";
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
  userOrganizationRoleMapping,
  userOrganizationRoleOptions,
  userOrganizationStatusColorMapping,
  userOrganizationStatusMapping,
} from "@/constants/user";
import { useOrganizationUsersQuery } from "@/services/organization-users/organizationUsers.query";
import {
  useActivateOrganizationUserMutation,
  useApproveOrganizationUserMutation,
  useEditOrganizationUserMutation,
  useSuspendOrganizationUserMutation,
} from "@/services/organization-users/organizationUsers.mutation";

export default function useUsersPage() {
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

  const { data, isLoading, isError, error } = useOrganizationUsersQuery({
    page,
    size,
    sortBy,
    search,
  });

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const { control, getValues, reset } = useForm<{
    role: UserOrganizationRole;
  }>();

  const suspendOrganizationUser = useSuspendOrganizationUserMutation();
  const activateOrganizationUser = useActivateOrganizationUserMutation();
  const approveOrganizationUser = useApproveOrganizationUserMutation();
  const editOrganizationUser = useEditOrganizationUserMutation();
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
      prev.set("page", String(defaultParameter.page));
      return prev;
    });

  const handleChangeSort = ({ id, direction }: ColumnSort) =>
    setSearchParams((prev) => {
      prev.set("sortBy", `${direction === "desc" ? "-" : ""}${id}`);
      return prev;
    });

  const handleClickChangeRole = (id: string, role: UserOrganizationRole) => {
    setEditingRoleId(id);
    reset({ role });
  };

  const onSaveChangeRole = async (id: string, role: UserOrganizationRole) => {
    if (
      !(await confirm({
        title: "Mengganti Role User",
        message: "Apakah Anda yakin ingin mengganti role user ini?",
      }))
    )
      return;
    const toastId = toast.loading("Sedang mengganti...");
    try {
      await editOrganizationUser.mutateAsync({ id, role });
      setEditingRoleId(null);
      toast.success("Berhasil Mengganti Role");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const columns: MRT_ColumnDef<UserOrganization>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      {
        accessorKey: "userId",
        header: "User ID",
        size: 160,
        enableSorting: false,
      },
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
                options: userOrganizationRoleOptions.map((role) => role.value),
                disableClearable: true,
                getOptionLabel: (option) => {
                  const roleOption = userOrganizationRoleOptions.find(
                    (r) => r.value === option,
                  );
                  return roleOption ? roleOption.label : "";
                },
              }}
              textFieldProps={{ sx: { minWidth: "200px" } }}
              size="small"
            />
          ) : (
            <Chip
              label={
                userOrganizationRoleMapping[
                  cell.getValue<UserOrganizationRole>()
                ]
              }
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
            label={
              userOrganizationStatusMapping[
                cell.getValue<UserOrganizationStatus>()
              ]
            }
            size="small"
            color={
              userOrganizationStatusColorMapping[
                cell.getValue<UserOrganizationStatus>()
              ]
            }
          />
        ),
      },
      {
        accessorKey: "approvedAt",
        header: "Approved At",
        size: 160,
        Cell: ({ cell }) => formatLocalDate(cell.getValue<string>()),
      },
      {
        accessorKey: "approvedById",
        header: "Approved by ID",
        size: 160,
        enableSorting: false,
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
      {
        accessorKey: "updatedById",
        header: "Updated by ID",
        size: 160,
        enableSorting: false,
      },
    ],
    [
      control,
      editingRoleId,
      editOrganizationUser.isPending,
      editOrganizationUser.variables,
      getValues,
    ],
  );

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  const handleClickApprove = async (id: string) => {
    if (
      !(await confirm({
        title: "Approve User",
        message: "Apakah Anda yakin ingin menyetujui user ini?",
      }))
    )
      return;
    const toastId = toast.loading("Sedang menyetujui...");
    try {
      await approveOrganizationUser.mutateAsync(id);
      toast.success("Berhasil Menyetujui");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

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
      await suspendOrganizationUser.mutateAsync(id);
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
      await activateOrganizationUser.mutateAsync(id);
      toast.success("Berhasil Mengaktifkan");
    } catch (error) {
      apiErrorHandler(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return {
    activateOrganizationUser,
    approveOrganizationUser,
    columns,
    data,
    editingRoleId,
    editOrganizationUser,
    isLoading,
    isError,
    isFormOpen,
    search: search ?? "",
    sortBy,
    suspendOrganizationUser,
    getValues,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleClickActivate,
    handleClickApprove,
    handleClickChangeRole,
    handleClickSuspend,
    handleResetFilter,
    onSaveChangeRole,
    setEditingRoleId,
    setIsFormOpen,
  };
}
