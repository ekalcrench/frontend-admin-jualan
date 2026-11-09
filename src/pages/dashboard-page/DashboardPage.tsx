import { Box, Stack, Typography } from "@mui/material";
import useDashboardPage from "./DashboardPage.hooks";
import ReportDate from "@/components/report-date";
import PageTitle from "@/components/page-title";
import { BoxCenter } from "@/styled/CustomBox";

export default function DashboardPage() {
  const { endDate, startDate, setEndDate, setStartDate } = useDashboardPage();

  return (
    <Box>
      {/* <Stack spacing={4}> */}
      {/* <PageTitle
        title="Dashboard"
        subTitle="Melihat ringkasan performa UMKM Anda"
      /> */}

      {/* <ReportDate
          endDate={endDate}
          startDate={startDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
        /> */}

      <BoxCenter sx={{ height: "calc(100vh - 80px)" }}>
        <Typography variant="h6">Coming soon...</Typography>
      </BoxCenter>
      {/* </Stack> */}
    </Box>
  );
}
