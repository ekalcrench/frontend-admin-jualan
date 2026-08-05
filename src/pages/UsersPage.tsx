import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useMemo } from "react";
import { useUsersQuery } from "../services/users/users.query";

export function UsersPage() {
  const { data, isLoading, isError } = useUsersQuery();

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
      {
        field: "role",
        headerName: "Role",
        width: 140,
        renderCell: (params: GridRenderCellParams<string>) => (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {params.value}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        valueFormatter: (params) =>
          params.value === "active" ? "Active" : "Inactive",
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <Typography variant="h5" className="font-semibold text-slate-900">
            Users
          </Typography>
          <Typography className="text-sm text-slate-600">
            Manage user accounts, roles, and status for the admin portal.
          </Typography>
        </div>
        <Button variant="contained">Add user</Button>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="h-[560px] w-full">
            <DataGrid
              rows={data ?? []}
              columns={columns}
              loading={isLoading}
              checkboxSelection
              disableSelectionOnClick
              pagination
              pageSizeOptions={[5, 10, 20]}
              sx={{ border: "none" }}
              componentsProps={{
                pagination: {
                  labelRowsPerPage: "Rows per page",
                },
              }}
              slots={{
                noRowsOverlay: () => (
                  <div className="flex h-full flex-col items-center justify-center text-slate-500">
                    <p>
                      {isError ? "Unable to load users." : "No users found."}
                    </p>
                  </div>
                ),
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
