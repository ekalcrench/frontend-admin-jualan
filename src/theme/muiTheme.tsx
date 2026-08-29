import { createTheme } from "@mui/material/styles";
// import type {} from "@mui/x-date-pickers/themeAugmentation";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#62AD9E",
    },
    secondary: {
      main: "#79A8D7",
    },
    success: {
      main: "#16A34A",
    },
    warning: {
      main: "#D97706",
    },
    error: {
      main: "#DC2626",
    },
    common: {
      white: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    info: {
      main: "#2563EB",
    },
    background: {
      default: "#F8FAFC",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",

    h1: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },

    h2: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },

    h3: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },

    h4: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },

    h5: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },

    h6: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
  },
  components: {
    mergeClassNameAndStyle: true,
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: ({ ownerState, theme: { palette, breakpoints } }) => ({
          textTransform: "none",
          minHeight: "48px",
          padding: "8px 20px",
          minWidth: "0px",
          lineHeight: 1.4,
          fontWeight: 500,
          fontFamily: "Poppins, sans-serif",
          borderRadius: "12px",
          ...(ownerState.variant === "contained" && {
            boxShadow: "none",
            color: palette.common.white,
            ":hover": {
              boxShadow: "none",
            },
            ":focus": {
              boxShadow: "none",
            },
          }),
          ...(ownerState.size === "small" && {
            minHeight: "36px",
            padding: "6px 16px",
          }),

          [breakpoints.down(600)]: {
            minHeight: "40px",
            padding: "6px 16px",

            ...(ownerState.size === "small" && {
              minHeight: "32px",
              padding: "4px 12px",
            }),
          },
        }),
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "text.primary",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ ownerState, theme: { palette } }) => ({
          borderRadius: "20px",
          boxSizing: "border-box",
          backgroundColor: palette.background.card,
          ...(ownerState.variant === "outlined" && {
            borderWidth: "2px",
          }),
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme: { breakpoints } }) => ({
          padding: "32px 24px",
          [breakpoints.down(600)]: {
            padding: "24px 16px",
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme: { palette } }) => ({
          borderRadius: "12px",
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState: { disabled }, theme: { palette } }) => ({
          color: palette.primary.main,
          borderRadius: "12px",
          ...(disabled && {
            backgroundColor: palette.background.disabled,
          }),
        }),
        input: ({
          ownerState: { error },
          theme: { breakpoints, palette },
        }) => ({
          padding: "0px 20px",
          height: "54px",
          color: error ? palette.error.main : palette.primary.main,
          fontWeight: 500,
          "&::placeholder": {
            color: palette.text.placeholder,
            fontWeight: 400,
            opacity: 1,
          },
          "&.Mui-disabled": {
            cursor: "not-allowed",
            borderRadius: "12px",
          },
          [breakpoints.down(600)]: {
            padding: "0px 16px",
            height: "48px",
          },
        }),
        focused: ({ theme: { palette } }) => ({
          color: palette.primary.main,
        }),
        notchedOutline: ({ ownerState: { error }, theme: { palette } }) => ({
          borderColor: `${error ? palette.error.main : palette.border.main}`,
        }),
      },
    },
    // MuiAutocomplete: {
    //   styleOverrides: {
    //     root: {
    //       padding: 0,
    //       "& .MuiOutlinedInput-root": {
    //         padding: 0,
    //       },
    //     },
    //     input: ({ theme: { breakpoints } }) => ({
    //       padding: "0px 20px !important",
    //       [breakpoints.down(600)]: {
    //         padding: "0px 16px !important",
    //       },
    //     }),
    //     inputRoot: ({ theme: { breakpoints } }) => ({
    //       paddingTop: "0px !important",
    //       paddingBottom: "0px !important",
    //       paddingLeft: "0px !important",
    //       height: "54px !important",
    //       [breakpoints.down(600)]: {
    //         height: "48px !important",
    //       },
    //     }),
    //     endAdornment: {
    //       right: "1rem !important",
    //     },
    //     clearIndicator: ({ theme: { palette } }) => ({
    //       visibility: "visible",
    //       marginRight: "0.5rem",
    //       color: palette.input.placeholder,
    //     }),
    //     listbox: {
    //       width: "100%",
    //       maxHeight: "186px",
    //       padding: "0px",
    //       borderRadius: "8px",
    //     },
    //     option: ({ theme: { palette } }) => ({
    //       minHeight: "44px !important",
    //       ":hover": {
    //         backgroundColor: `${palette.primary.main} !important`,
    //         color: `${palette.common.white} !important`,
    //       },
    //     }),
    //     paper: ({ theme: { palette } }) => ({
    //       marginTop: "8px",
    //       marginBottom: "8px",
    //       boxShadow: `0px 4px 10px ${palette.card.boxShadow}`,
    //       borderRadius: "8px",
    //     }),
    //     noOptions: {
    //       // fontSize: defaultFontSize,
    //       // color: appColors.yankeesBlue,
    //     },
    //     loading: {
    //       // fontSize: defaultFontSize,
    //       // color: appColors.yankeesBlue,
    //     },
    //   },
    // },
    // MuiPopover: {
    //   styleOverrides: {
    //     paper: {
    //       borderRadius: "8px !important",
    //       padding: "16px 24px",
    //     },
    //   },
    // },
    // MuiPickersPopper: {
    //   styleOverrides: {
    //     paper: {
    //       borderRadius: "8px !important",
    //     },
    //   },
    // },
    // MuiDateCalendar: {
    //   styleOverrides: {
    //     root: ({ ownerState, theme: { palette } }) => ({
    //       "& .Mui-selected": {
    //         color: `${palette.common.white} !important`,
    //       },
    //       "& .MuiSvgIcon-root": {
    //         color: `${palette.primary.main} !important`,
    //       },
    //     }),
    //   },
    // },
    // MuiMultiSectionDigitalClock: {
    //   styleOverrides: {
    //     root: ({ ownerState, theme: { palette } }) => ({
    //       "& .Mui-selected": {
    //         color: `${palette.common.white} !important`,
    //       },
    //     }),
    //   },
    // },
    // MuiAccordion: {
    //   styleOverrides: {
    //     root: ({ ownerState, theme: { palette, breakpoints } }) => ({
    //       padding: "24px 20px",
    //       borderRadius: "10px !important",
    //       boxSizing: "border-box",
    //       // fontFamily: poppins.style.fontFamily,
    //       boxShadow: "none",
    //       [breakpoints.down(600)]: {
    //         padding: "20px 16px",
    //       },
    //     }),
    //     expanded: ({ ownerState, theme: { palette, breakpoints } }) => ({
    //       minHeight: 0,
    //       margin: 0,
    //     }),
    //   },
    // },
    // MuiAccordionSummary: {
    //   styleOverrides: {
    //     root: ({ ownerState, theme: { palette, breakpoints } }) => ({
    //       padding: 0,
    //       height: "auto !important",
    //       minHeight: "auto !important",
    //       boxSizing: "border-box",
    //       // fontFamily: poppins.style.fontFamily,
    //     }),
    //     content: ({ ownerState, theme: { palette, breakpoints } }) => ({
    //       margin: "0px !important",
    //     }),
    //   },
    // },
    // MuiAccordionDetails: {
    //   styleOverrides: {
    //     root: ({ ownerState, theme: { palette, breakpoints } }) => ({
    //       paddingLeft: 0,
    //       paddingTop: "16px",
    //       paddingRight: "48px",
    //       paddingBottom: 0,
    //       boxSizing: "border-box",
    //       // fontFamily: poppins.style.fontFamily,
    //     }),
    //   },
    // },
    // MuiMenu: {
    //   styleOverrides: {
    //     paper: ({ theme: { palette } }) => ({
    //       marginTop: "8px",
    //       padding: "0px",
    //       boxShadow: `0px 4px 10px ${palette.card.boxShadow}`,
    //     }),
    //   },
    // },
  },
});

// ---- CUSTOM NAME THEME----

declare module "@mui/material/styles" {
  interface TypeBackground {
    card?: string;
    sidebar?: string;
    disabled?: string;
  }

  interface TypeText {
    placeholder?: string;
  }

  interface Palette {
    border: Palette["primary"];
  }

  interface PaletteOptions {
    border?: PaletteOptions["primary"];
  }
}

theme = createTheme(theme, {
  palette: {
    border: {
      main: "#E2E8F0",
    },
    background: {
      card: "#FFFFFF",
      sidebar: "#3F3F46",
      disabled: "#E2E8F0",
    },
    text: {
      placeholder: "#B8B8B8",
    },
  },
});

export default theme;
