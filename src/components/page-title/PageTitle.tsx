import { Box, Typography } from "@mui/material";
import { PageTitleProps } from "./PageTitle.types";

export default function PageTitle({ title, subTitle }: PageTitleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        columnGap: "8px",
        padding: { xs: "12px 8px 0px", sm: "0px 8px" },
      }}
    >
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {`(${subTitle})`}
      </Typography>
    </Box>
  );
}
