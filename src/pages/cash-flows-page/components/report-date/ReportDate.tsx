import CustomDateTimePicker from "@/components/custom-date-time-picker";
import {
  BoxCenter,
  BoxFlex,
  BoxFlexEnd,
  BoxFlexSpaceBetween,
} from "@/styled/CustomBox";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  ButtonGroup,
  Button,
  Collapse,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import useReportDate from "./ReportDate.hooks";
import SearchIcon from "@mui/icons-material/Search";
import { boxShadowMain } from "@/constants/styled";
import CustomDatePicker from "@/components/custom-date-picker";

export default function ReportDate() {
  const {
    control,
    openCollapse,
    reportDateType,
    handleClickCustomDate,
    handleClickOneMonth,
    handleClickOneWeek,
    handleClickOneYear,
    handleClickToday,
    handleSubmit,
    onSubmit,
  } = useReportDate();

  return (
    <Accordion
      sx={{
        borderRadius: "16px",
        boxShadow: boxShadowMain,
        overflow: "hidden",
        // Menghilangkan garis bawaan MUI
        "&::before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ paddingTop: "8px", paddingBottom: "8px" }}
      >
        <BoxFlex sx={{ gap: "8px" }}>
          <CalendarMonthIcon />
          <Typography sx={{ fontWeight: 600 }}>Periode Laporan</Typography>
        </BoxFlex>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingBottom: "20px", paddingTop: "0px" }}>
        <ButtonGroup>
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
            onClick={handleClickCustomDate}
            variant={reportDateType === "CUSTOM" ? "contained" : "outlined"}
          >
            Custom
          </Button>
        </ButtonGroup>

        <Collapse in={openCollapse}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <BoxFlexSpaceBetween sx={{ gap: "16px", marginTop: "20px" }}>
              <CustomDatePicker
                control={control}
                name="startDate"
                boxFieldWrapperProps={{ sx: { flex: 1 } }}
              />
              <BoxCenter sx={{ height: "100%" }}>
                <Typography>-</Typography>
              </BoxCenter>
              <CustomDatePicker
                control={control}
                name="endDate"
                boxFieldWrapperProps={{ sx: { flex: 1 } }}
              />
              <Button type="submit" startIcon={<SearchIcon />}>
                Cari
              </Button>
            </BoxFlexSpaceBetween>
          </form>
        </Collapse>
      </AccordionDetails>
    </Accordion>
  );
}
