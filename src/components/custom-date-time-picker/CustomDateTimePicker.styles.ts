import { styled } from "@mui/material/styles";
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers";

export const DateTimePickerStyled = styled(DateTimePicker, {
  shouldForwardProp: (props) => props !== "isError",
})<DateTimePickerProps & { isError: boolean }>(({ theme, isError }) => ({
  width: "100%",
  minWidth: 0,
  "& .MuiPickersOutlinedInput-root": {
    minWidth: 0,
    height: 54,
    borderRadius: "12px",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    "&.Mui-disabled": {
      backgroundColor: theme.palette.background.disabled,
    },
    [theme.breakpoints.down(600)]: {
      height: 48,
    },
  },
  "& .MuiPickersOutlinedInput-notchedOutline": {
    borderColor: isError ? theme.palette.error.main : theme.palette.border.main,
    borderRadius: "12px",
  },
  "& .MuiPickersOutlinedInput-root:hover .MuiPickersOutlinedInput-notchedOutline":
    {
      borderColor: isError
        ? theme.palette.error.main
        : theme.palette.text.primary,
    },
  "& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline":
    {
      borderColor: isError
        ? theme.palette.error.main
        : theme.palette.primary.main,
    },
  "& .MuiPickersOutlinedInput-sectionContent": {
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
}));
