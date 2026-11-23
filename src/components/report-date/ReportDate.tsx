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
        paddingBottom: "4px",
      }}
    >
      <ButtonGroup
        sx={{ width: "max-content", flexWrap: "nowrap" }}
        size="small"
      >
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
              width: "100%",
              gap: "8px",
              marginTop: "16px",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <CustomDatePicker
              control={control}
              name="startDate"
              boxFieldWrapperProps={{
                sx: { flex: 1, width: { xs: "100%", sm: "auto" }, minWidth: 0 },
              }}
              renderErrorMessage
            />
            <BoxCenter
              sx={{
                height: "100%",
                paddingBottom: { xs: 0, sm: "20px" },
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Typography sx={{ fontSize: "20px" }}>-</Typography>
            </BoxCenter>
            <CustomDatePicker
              control={control}
              name="endDate"
              boxFieldWrapperProps={{
                sx: { flex: 1, width: { xs: "100%", sm: "auto" }, minWidth: 0 },
              }}
              renderErrorMessage
            />
            <Button
              type="submit"
              startIcon={<SearchIcon />}
              sx={{
                marginLeft: { xs: 0, sm: "8px" },
                marginBottom: { xs: 0, sm: "20px" },
                width: { xs: "100%", sm: "auto" },
                flexShrink: 0,
              }}
            >
              Cari
            </Button>
          </BoxFlexSpaceBetween>
        </form>
      </Collapse>
    </Box>
  );
}
