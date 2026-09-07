import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useUmkmPage from "./UmkmPage.hooks";
import { UmkmForm } from "./components/umkm-form";

export default function UmkmPage() {
  const { columns, data, isFormOpen, isLoading, isError, setIsFormOpen } =
    useUmkmPage();

  return (
    <Stack spacing={3}>
      <UmkmForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onOpen={() => setIsFormOpen(true)}
        setIsFormOpen={setIsFormOpen}
      />

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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
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
