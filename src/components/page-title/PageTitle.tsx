import { Box, Typography } from "@mui/material";
import { PageTitleProps } from "./PageTitle.types";
import { BoxFlexSpaceBetween } from "@/styled/CustomBox";

export default function PageTitle({
  addButton,
  title,
  subTitle,
}: PageTitleProps) {
  return (
    <BoxFlexSpaceBetween
      sx={{
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        gap: "16px",
        padding: { xs: "12px 8px 0px", sm: "0px 8px" },
      }}
    >
      <Box>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {`(${subTitle})`}
        </Typography>
      </Box>
      {addButton}
    </BoxFlexSpaceBetween>
  );
}
