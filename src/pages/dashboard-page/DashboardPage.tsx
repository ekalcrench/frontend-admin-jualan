import { Box, Stack, Typography } from "@mui/material";
import useDashboardPage from "./DashboardPage.hooks";
import ReportDate from "@/components/report-date";
import PageTitle from "@/components/page-title";

export default function DashboardPage() {
  const { endDate, startDate, setEndDate, setStartDate } = useDashboardPage();

  return (
    <Box>
      <Stack spacing={4}>
        <PageTitle
          title="Dashboard"
          subTitle="Melihat ringkasan performa UMKM Anda"
        />

        <ReportDate
          endDate={endDate}
          startDate={startDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
        />
      </Stack>
    </Box>
  );
}
