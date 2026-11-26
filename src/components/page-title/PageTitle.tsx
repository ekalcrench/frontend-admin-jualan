import { Box, Button, Stack, Typography } from "@mui/material";
import { PageTitleProps } from "./PageTitle.types";
import { BoxFlexSpaceBetween } from "@/styled/CustomBox";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function PageTitle({
  title,
  subTitle,
  addButton,
  navigateTo,
  enableBackButton,
}: PageTitleProps) {
  const navigate = useNavigate();
  return (
    <Stack spacing={1}>
      {(enableBackButton || navigateTo) && (
        <Box>
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              if (navigateTo) navigate(navigateTo);
              else navigate(-1);
            }}
            sx={{ marginTop: { xs: "12px", md: "0px" }, marginLeft: "-8px" }}
          >
            Kembali
          </Button>
        </Box>
      )}
      <BoxFlexSpaceBetween
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: "16px",
          padding: {
            xs: enableBackButton ? "0px 8px" : "12px 8px 0px",
            md: "0px 8px",
          },
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
    </Stack>
  );
}
