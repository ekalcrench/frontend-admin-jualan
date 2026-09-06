import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { Organization } from "@/types/organization";
import { useOrganizationsQuery } from "@/services/organizations/organizations.query";
import { storageBaseUrl } from "@/constants/api";
import AddIcon from "@mui/icons-material/Add";

export default function UmkmPage() {
  const { data, isLoading, isError } = useOrganizationsQuery();

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

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: "16px",
          padding: "16px 12px",
        }}
      >
        <Box>
          <Typography variant="h5">UMKM</Typography>
          <Typography variant="body2" color="text.secondary">
            Mengatur UMKM yang sudah, maupun akan terdaftar dalam sistem
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />}>
          Add UMKM
        </Button>
      </Box>

      <Card
        sx={{
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          boxShadow: 1,
        }}
      >
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <Box sx={{ height: 560, width: "100%" }}>
            <DataGrid
              rows={data ?? []}
              columns={columns}
              loading={isLoading}
              checkboxSelection
              disableRowSelectionOnClick
              pagination
              pageSizeOptions={[5, 10, 20]}
              sx={{ border: "none" }}
              slots={{
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "text.secondary",
                    }}
                  >
                    <Typography variant="body2">
                      {isError ? "Unable to load users." : "No users found."}
                    </Typography>
                  </Box>
                ),
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
