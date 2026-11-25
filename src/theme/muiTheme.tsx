import { createTheme, type PaletteColor } from "@mui/material/styles";
import { boxShadowDialog, borderRadiusCard } from "@/constants/styled";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563A6",
      light: "#80AED8",
      dark: "#1D4F82",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A66825",
      light: "#D6A66F",
      dark: "#754719",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#19BD7B",
      light: "#75DDB1",
      dark: "#108957",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D99A21",
      light: "#FEF3C7",
      dark: "#A66B0B",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC4545",
      light: "#ff7272",
      dark: "#B42323",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#5A7799",
      light: "#8BA3BE",
      dark: "#3B536F",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#18181B",
      secondary: "#71717A",
    },
    common: {
      white: "#FFFFFF",
      black: "#0F172A",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
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
    MuiCssBaseline: {
      styleOverrides: {
        "*::-webkit-scrollbar": {
          width: "8px",
          height: "4px",
        },
        "*::-webkit-scrollbar-track": {
          background: "rgba(238, 238, 238, 0.2)",
        },
        "*::-webkit-scrollbar-thumb": {
          border: "1px solid rgba(0, 0, 0, 0)",
          backgroundClip: "padding-box",
          borderRadius: "12px",
          backgroundColor: "#80AED8",
          boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.025)",
          transition: "background-color 0.3s",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#2563A6",
        },
        "*::-webkit-scrollbar-button": {
          width: 0,
          height: 0,
          display: "none",
        },
        "*::-webkit-scrollbar-corner": {
          backgroundColor: "transparent",
        },
      },
    },
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
            // color: palette.common.white,
            ":hover": {
              boxShadow: "none",
            },
            ":focus": {
              boxShadow: "none",
            },
          }),
          ...(ownerState.size === "small" && {
            minHeight: "40px",
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
          borderRadius: "16px",
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
          backgroundColor: palette.background.paper,
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
          paddingTop: "0px",
          paddingBottom: "0px",
          height: "54px",
          color: error ? palette.error.main : palette.text.primary,
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
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          padding: 0,
          "& .MuiOutlinedInput-root": {
            padding: 0,
          },
        },
        input: ({ theme: { breakpoints } }) => ({
          height: "54px",
          // padding: "0px !important",
          paddingLeft: "14px !important",
          boxSizing: "border-box",
        }),
        inputRoot: ({ theme: { breakpoints } }) => ({
          // paddingTop: "0px",
          // paddingBottom: "0px",
          height: "54px",
          [breakpoints.down(600)]: {
            height: "48px",
          },
        }),
        clearIndicator: ({ theme: { palette } }) => ({
          visibility: "visible",
          color: palette.text.placeholder,
        }),
        listbox: {
          width: "100%",
          maxHeight: "186px",
          padding: "0px",
          borderRadius: "8px",
        },
        option: ({ theme: { palette } }) => ({
          minHeight: "44px !important",
          ":hover": {
            backgroundColor: `${palette.primary.main} !important`,
            color: `${palette.common.white} !important`,
          },
        }),
        paper: ({ theme: { palette } }) => ({
          marginTop: "8px",
          marginBottom: "8px",
          boxShadow: boxShadowDialog,
          borderRadius: borderRadiusCard,
        }),
        noOptions: {
          // fontSize: defaultFontSize,
          // color: appColors.yankeesBlue,
        },
        loading: {
          // fontSize: defaultFontSize,
          // color: appColors.yankeesBlue,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme: { palette } }) => ({
          backgroundColor: palette.background.sidebar,
          color: palette.text.sidebar,
          borderColor: palette.border.sidebar,
        }),
      },
    },
    MuiList: {
      styleOverrides: {
        root: () => ({
          paddingTop: "12px",
          paddingBottom: "12px",
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          width: "auto",
          maxWidth: "200px",
          boxSizing: "border-box",
          padding: "16px 20px",
          marginTop: "8px",
          boxShadow: boxShadowDialog,
          borderRadius: borderRadiusCard,
        },
        list: {
          padding: "0px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme: { palette } }) => ({
          "&.active-sidebar": {
            backgroundColor: palette.background.sidebarActive,
            pointerEvents: "none",
          },
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme: { palette } }) => ({
          color: palette.icon.sidebar,
        }),
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: ({ theme: { palette } }) => ({
          "&.active-item-text": {
            color: palette.text.sidebarActive,
          },
          color: palette.text.sidebar,
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme: { palette, breakpoints } }) => ({
          paddingTop: "16px",
          paddingBottom: "8px",
          minHeight: "40px !important",
          color: palette.text.sidebarActive,
          [breakpoints.down(600)]: {
            paddingTop: "8px",
            paddingBottom: "8px",
            minHeight: "40px",
          },
        }),
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme: { palette, breakpoints } }) => ({
          borderRadius: "8px",
          borderColor: palette.border.main,
        }),
      },
    },
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
    sidebarActive?: string;
    disabled?: string;
  }

  interface TypeText {
    placeholder?: string;
    sidebar?: string;
    sidebarActive?: string;
  }

  interface TypeIcon extends PaletteColor {
    sidebar?: string;
  }

  interface TypeBorder extends PaletteColor {
    sidebar?: string;
  }

  interface Palette {
    border: TypeBorder;
    icon: TypeIcon;
  }

  interface PaletteOptions {
    border?: PaletteOptions["primary"];
    icon?: PaletteOptions["primary"];
  }
}

theme = createTheme(theme, {
  palette: {
    border: {
      main: "#E2E8F0",
      sidebar: "rgba(255, 255, 255, 0.1)",
    },
    background: {
      card: "#FFFFFF",
      sidebar: "#1f2e40",
      sidebarActive: "#2563A6",
      disabled: "#F1F5F9",
    },
    text: {
      placeholder: "#94A3B8",
      sidebar: "#B8C7D8",
      sidebarActive: "#FFFFFF",
    },
    icon: {
      sidebar: "#B8C7D8",
    },
  },
});

export default theme;
