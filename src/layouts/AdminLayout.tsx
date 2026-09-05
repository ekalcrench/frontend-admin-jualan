import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Sidebar } from "@/components/sidebar";
import { CustomMain } from "@/styled/CustomHtml";

export function AdminLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <CustomMain>
        <Outlet />
      </CustomMain>
    </Box>
  );
}
