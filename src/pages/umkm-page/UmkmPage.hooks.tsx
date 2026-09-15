import { storageBaseUrl } from "@/constants/api";
import { defaultParameter } from "@/constants/table";
import { useOrganizationsQuery } from "@/services/organizations/organizations.query";
import { Organization } from "@/types/organization";
import { ColumnSort } from "@/types/table";
import { apiErrorHandler } from "@/utils/api";
import { formatLocalDate } from "@/utils/dateTime";
import { Box, Avatar } from "@mui/material";
import { type MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useUmkmPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? defaultParameter.page);
  const size = Number(searchParams.get("size") ?? defaultParameter.size);
  const sortBy = searchParams.get("sortBy") ?? defaultParameter.sortBy;
  const search = searchParams.get("search") ?? undefined;
  const email = searchParams.get("email") ?? undefined;
  const name = searchParams.get("name") ?? undefined;

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

    if (changed) {
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data, isLoading, isError, error } = useOrganizationsQuery({
    page,
    size,
    sortBy,
    search,
    email,
    name,
  });

  const handleChangePage = (value: number) => {
    setSearchParams((prev) => {
      prev.set("page", `${value}`);
      return prev;
    });
  };

  const handleChangeSearch = (value: string) => {
    console.log(">>> value : ", value);
    setSearchParams((prev) => {
      if (value.trim()) prev.set("search", value);
      else prev.delete("search");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });
  };

  const handleResetFilter = () => {
    setSearchParams((prev) => {
      prev.delete("search");
      prev.delete("email");
      prev.delete("name");
      prev.set("page", String(defaultParameter.page));
      return prev;
    });
  };

  const handleChangeSort = (sortBy: ColumnSort) => {
    console.log(">>> sortBy : ", sortBy);

    const sortById = sortBy.id;
    let sortByDirection = "";

    if (sortBy.direction === "desc") {
      sortByDirection = "-";
    }

    setSearchParams((prev) => {
      prev.set("sortBy", `${sortByDirection}${sortById}`);
      return prev;
    });
  };

  const columns: MRT_ColumnDef<Organization>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 160, enableSorting: false },
      {
        accessorKey: "logoUrl",
        header: "Logo",
        size: 80,
        minSize: 80,
        enableSorting: false,
        Cell: ({ cell, row }) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar
              src={`${storageBaseUrl}${cell.getValue<string>()}`}
              alt={row.original.name}
              sx={{ width: 32, height: 32 }}
            />
          </Box>
        ),
      },
      { accessorKey: "name", header: "Nama", size: 170 },
      { accessorKey: "email", header: "Email", size: 220 },
      { accessorKey: "phone", header: "Nomor HP", size: 150 },
      {
        accessorKey: "address",
        header: "Alamat",
        grow: true,
        minSize: 160,
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
    ],
    [],
  );

  useEffect(() => {
    if (isError && error) apiErrorHandler(error);
  }, [isError, error]);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return {
    columns,
    data,
    isFormOpen,
    isLoading,
    isError,
    sortBy,
    handleChangePage,
    handleChangeSearch,
    handleChangeSort,
    handleResetFilter,
    search: search ?? "",
    setIsFormOpen,
  };
}
