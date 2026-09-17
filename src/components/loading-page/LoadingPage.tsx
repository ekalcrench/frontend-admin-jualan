import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <CircularProgress size={48} />

      <Typography sx={{ marginTop: "24px" }}>Loading...</Typography>
    </Box>
  );
}
