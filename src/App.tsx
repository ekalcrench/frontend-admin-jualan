import RouteLayout from "./layouts/RouteLayout";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme/muiTheme";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RouteLayout />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
