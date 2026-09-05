import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useUsersQuery } from "@/services/users/users.query";
import type { User } from "@/services/users/users.types";

export default function UsersPage() {
  const { data, isLoading, isError } = useUsersQuery();

  const columns = useMemo<GridColDef<User>[]>(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
      {
        field: "role",
        headerName: "Role",
        width: 140,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: "action.hover",
              color: "text.secondary",
              fontWeight: 600,
            }}
          />
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        valueFormatter: (value) =>
          value === "ACTIVE"
            ? "Active"
            : value === "PENDING_EMAIL"
              ? "Pending"
              : "Suspended",
      },
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
          gap: 2,
          backgroundColor: "background.paper",
          borderRadius: 3,
          boxShadow: 1,
          p: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user accounts, roles, and status for the admin portal.
          </Typography>
        </Box>
        <Button variant="contained">Add user</Button>
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
