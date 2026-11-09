import { BoxCenter, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { Typography, ButtonGroup, Button, Collapse, Box } from "@mui/material";
import useReportDate from "./ReportDate.hooks";
import SearchIcon from "@mui/icons-material/Search";
import CustomDatePicker from "@/components/custom-date-picker";
import { ReportDateProps } from "./ReportDate.types";

export default function ReportDate(props: ReportDateProps) {
  const {
    control,
    openCollapse,
    reportDateType,
    handleClickAllTime,
    handleClickCustomDate,
    handleClickOneMonth,
    handleClickOneWeek,
    handleClickOneYear,
    handleClickToday,
    handleSubmit,
    onSubmit,
  } = useReportDate(props);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <ButtonGroup sx={{ width: "max-content", flexWrap: "nowrap" }} size="small">
        <Button
          onClick={handleClickToday}
          variant={reportDateType === "TODAY" ? "contained" : "outlined"}
        >
          Hari ini
        </Button>
        <Button
          onClick={handleClickOneWeek}
          variant={reportDateType === "A_WEEK" ? "contained" : "outlined"}
        >
          1 Minggu
        </Button>
        <Button
          onClick={handleClickOneMonth}
          variant={reportDateType === "A_MONTH" ? "contained" : "outlined"}
        >
          1 Bulan
        </Button>
        <Button
          onClick={handleClickOneYear}
          variant={reportDateType === "A_YEAR" ? "contained" : "outlined"}
        >
          1 Tahun
        </Button>
        <Button
          onClick={handleClickAllTime}
          variant={reportDateType === "ALL_TIME" ? "contained" : "outlined"}
        >
          Semua
        </Button>
        <Button
          onClick={handleClickCustomDate}
          variant={reportDateType === "CUSTOM" ? "contained" : "outlined"}
        >
          Custom
        </Button>
      </ButtonGroup>

      <Collapse in={openCollapse} sx={{ width: "100%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <BoxFlexSpaceBetween
            sx={{
              width: { xs: "560px", sm: "100%" },
              minWidth: { xs: "560px", sm: 0 },
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <CustomDatePicker
              control={control}
              name="startDate"
              boxFieldWrapperProps={{ sx: { flex: 1 } }}
              renderErrorMessage
            />
            <BoxCenter sx={{ height: "100%", paddingBottom: "20px" }}>
              <Typography sx={{ fontSize: "20px" }}>-</Typography>
            </BoxCenter>
            <CustomDatePicker
              control={control}
              name="endDate"
              boxFieldWrapperProps={{ sx: { flex: 1 } }}
              renderErrorMessage
            />
            <Button
              type="submit"
              startIcon={<SearchIcon />}
              sx={{ marginLeft: "8px", marginBottom: "20px" }}
            >
              Cari
            </Button>
          </BoxFlexSpaceBetween>
        </form>
      </Collapse>
    </Box>
  );
}
