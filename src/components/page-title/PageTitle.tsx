import { Box, Typography } from "@mui/material";
import { PageTitleProps } from "./PageTitle.types";

export default function PageTitle({ title, subTitle }: PageTitleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: "8px",
        padding: "0px 8px",
      }}
    >
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {`(${subTitle})`}
      </Typography>
    </Box>
  );
}
