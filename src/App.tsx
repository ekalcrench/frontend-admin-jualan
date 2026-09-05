import RouteLayout from "./layouts/RouteLayout";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme/muiTheme";
import AppLayout from "./layouts/AppLayout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppLayout>
            <RouteLayout />
          </AppLayout>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
