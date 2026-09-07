import { storageBaseUrl } from "@/constants/api";
import { useOrganizationsQuery } from "@/services/organizations/organizations.query";
import { Organization } from "@/types/organization";
import { Box, Avatar } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

export default function useUmkmPage() {
  const { data, isLoading, isError } = useOrganizationsQuery();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const columns = useMemo<GridColDef<Organization>[]>(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      {
        field: "logoUrl",
        headerName: "Logo",
        width: 80,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar
              src={`${storageBaseUrl}${params.value}`}
              alt={params.row.name}
              sx={{ width: 32, height: 32 }}
            />
          </Box>
        ),
      },
      { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
    ],
    [],
  );

  return {
    columns,
    data,
    isFormOpen,
    isLoading,
    isError,
    setIsFormOpen,
  };
}
