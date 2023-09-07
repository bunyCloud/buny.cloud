export const theme = {
  palette: {
    primary: { main: "#1D9E33" },
    secondary: { main: "#BBA464" },
    error: { main: "#D9000C" },
    text: {
      primary: "#032239",
      secondary: "#515D6B",
    },
    background: {
      default: "white",
    },
    divider: "#E5E8EC",
  },
  typography: {
    fontFamily: [
      "Source Sans Pro",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  overrides: {
    MuiButton: {
      root: {
        height: "40px",
        fontSize: "16px",
        lineHeight: "24px",
        letterSpacing: "0",
      },
      disabled: {
        color: "#637381 !important",
        backgroundColor: "#E5E8EC !important",
      },
    },

    MuiOutlinedInput: {
      // add styles for the root
      root: {
        "Mui-error": {
          border: "blue !important",
        },
      },

      // add styles for the root when disabled

      disabled: {
        color: "#637381 !important",
        borderColor: "#B5BEC8",
        background: "#F5F6F7",
      },
    },

    /// other component can be styled just need to inspect the component you want to style and get the class name eg: MuiFormHelperText-root will be

    MuiFormHelperText: {
      root: {
        fontSize: "16px !important",
      },
    },
  },
  props: {
    MuiButton: {
      fullWidth: true,
      disableElevation: true,
    },
  },
};
