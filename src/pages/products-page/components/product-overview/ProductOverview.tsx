import { CardOverview } from "@/styled/CustomCard";
import useProductOverview from "./ProductOverview.hooks";
import { BoxCenter, BoxFlex } from "@/styled/CustomBox";
import { TypographyTab } from "@/styled/CustomTypography";
import { numberFormat } from "@/utils/number";
import { Grid, Typography, Box, Skeleton, Stack } from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

export default function ProductOverview() {
  const { data, isLoading } = useProductOverview();

  return (
    <Grid container spacing={2} size={12}>
      <Grid size={{ xs: 12, md: 6, xl: 4 }}>
        <CardOverview>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <PriorityHighIcon color="error" />
            <Typography>
              Stok Terendah{" "}
              {isLoading ? (
                <Skeleton
                  component="span"
                  sx={{ display: "inline-block", verticalAlign: "middle" }}
                  width={64}
                  height={24}
                />
              ) : data?.length ? (
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {`(${numberFormat.format(data.length)} produk)`}
                </Typography>
              ) : (
                <Typography component={"span"}>(0 produk)</Typography>
              )}
            </Typography>
          </BoxFlex>

          <Stack spacing={1}>
            {isLoading ? (
              <Box>
                <TypographyTab variant="body2">
                  {`Nama Produk\t: `}
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={140}
                    height={20}
                  />
                </TypographyTab>
                <TypographyTab variant="body2">
                  {`Stok\t\t\t: `}
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={32}
                    height={20}
                  />
                </TypographyTab>
              </Box>
            ) : data?.length ? (
              data.map((value, index) => (
                <Box key={index}>
                  <TypographyTab variant="body2">
                    {`Nama Produk\t: ${value.name || "-"}`}
                  </TypographyTab>
                  <TypographyTab variant="body2">
                    {`Stok\t\t\t: ${numberFormat.format(value.stock)}`}
                  </TypographyTab>
                </Box>
              ))
            ) : (
              <BoxCenter>
                <Typography>Data tidak ditemukan</Typography>
              </BoxCenter>
            )}
          </Stack>
        </CardOverview>
      </Grid>
    </Grid>
  );
}
