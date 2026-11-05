import { Grid, Typography, Skeleton, Box } from "@mui/material";
import useSalesOverview from "./SalesOverview.hooks";
import { currencyFormatter } from "@/utils/currency";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { BoxFlex } from "@/styled/CustomBox";
import SellIcon from "@mui/icons-material/Sell";
import { SalesOverviewProps } from "./SalesOverview.types";
import { numberFormat } from "@/utils/number";
import { formatLocalDate, getPreviousPeriodLabel } from "@/utils/dateTime";
import {
  calculatePercentageDifference,
  formatPercentageDifference,
} from "@/utils/generalUtils";
import { TypographyTab } from "@/styled/CustomTypography";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import {
  CustomTrendingUpIcon,
  CustomTrendingDownIcon,
} from "@/styled/CustomIcon";
import { CardOverview } from "@/styled/CustomCard";

export default function SalesOverview(props: SalesOverviewProps) {
  const { data, dataOverviewItems, isLoading, isLoadingOverviewItems } =
    useSalesOverview(props);

  const previousPeriodLabel = getPreviousPeriodLabel(
    props.startDate ?? "",
    props.endDate ?? "",
  );
  const amountPercentage =
    data === undefined
      ? undefined
      : calculatePercentageDifference(data.totalAmount, data.prevTotalAmount);
  const quantityPercentage =
    data === undefined
      ? undefined
      : calculatePercentageDifference(
          data.totalQuantity,
          data.prevTotalQuantity,
        );
  const grossProfitPercentage =
    data === undefined
      ? undefined
      : calculatePercentageDifference(
          data.totalGrossProfit,
          data.prevTotalGrossProfit,
        );

  return (
    <Grid container spacing={2}>
      {/* Overview */}
      <Grid container spacing={2} size={12}>
        <Grid size={{ xs: 12, md: 4, xl: 3 }}>
          <CardOverview>
            <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
              <CurrencyExchangeIcon color="primary" />
              <Typography>Omset Penjualan</Typography>
            </BoxFlex>
            {isLoading ? (
              <Skeleton variant="rounded" width={160} height={32} />
            ) : (
              <Typography variant="h5">
                {data === undefined
                  ? "-"
                  : currencyFormatter.format(data?.totalAmount ?? 0)}
              </Typography>
            )}
            {props.startDate && props.endDate ? (
              isLoading ? (
                <Skeleton
                  variant="rounded"
                  width={160}
                  height={16}
                  sx={{ marginTop: "4px" }}
                />
              ) : data === undefined ? null : (
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "4px",
                    color:
                      amountPercentage! > 0
                        ? "success.light"
                        : amountPercentage! < 0
                          ? "error.light"
                          : "inherit",
                  }}
                >
                  {amountPercentage! > 0 ? (
                    <CustomTrendingUpIcon />
                  ) : amountPercentage! < 0 ? (
                    <CustomTrendingDownIcon />
                  ) : null}
                  {formatPercentageDifference(amountPercentage!)}{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    vs {previousPeriodLabel}
                  </Typography>
                </Typography>
              )
            ) : null}
          </CardOverview>
        </Grid>
        <Grid size={{ xs: 12, md: 4, xl: 3 }}>
          <CardOverview>
            <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
              <MonetizationOnIcon color="success" />
              <Typography>Keuntungan Kotor</Typography>
            </BoxFlex>
            {isLoading ? (
              <Skeleton variant="rounded" width={160} height={32} />
            ) : (
              <Typography variant="h5">
                {data === undefined
                  ? "-"
                  : currencyFormatter.format(data?.totalGrossProfit ?? 0)}
              </Typography>
            )}

            {props.startDate && props.endDate ? (
              isLoading ? (
                <Skeleton
                  variant="rounded"
                  width={160}
                  height={16}
                  sx={{ marginTop: "4px" }}
                />
              ) : data === undefined ? null : (
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "4px",
                    color:
                      grossProfitPercentage! > 0
                        ? "success.light"
                        : grossProfitPercentage! < 0
                          ? "error.light"
                          : "inherit",
                  }}
                >
                  {grossProfitPercentage! > 0 ? (
                    <CustomTrendingUpIcon />
                  ) : grossProfitPercentage! < 0 ? (
                    <CustomTrendingDownIcon />
                  ) : null}
                  {formatPercentageDifference(grossProfitPercentage!)}{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    vs {previousPeriodLabel}
                  </Typography>
                </Typography>
              )
            ) : null}
          </CardOverview>
        </Grid>
        <Grid size={{ xs: 12, md: 4, xl: 3 }}>
          <CardOverview>
            <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
              <SellIcon color="action" />
              <Typography>Barang Terjual</Typography>
            </BoxFlex>
            {isLoading ? (
              <Skeleton variant="rounded" width={160} height={32} />
            ) : (
              <Typography variant="h5">
                {data === undefined
                  ? "-"
                  : numberFormat.format(data?.totalQuantity ?? 0)}
              </Typography>
            )}

            {props.startDate && props.endDate ? (
              isLoading ? (
                <Skeleton
                  variant="rounded"
                  width={160}
                  height={16}
                  sx={{ marginTop: "4px" }}
                />
              ) : data === undefined ? null : (
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "4px",
                    color:
                      quantityPercentage! > 0
                        ? "success.light"
                        : quantityPercentage! < 0
                          ? "error.light"
                          : "inherit",
                  }}
                >
                  {quantityPercentage! > 0 ? (
                    <CustomTrendingUpIcon />
                  ) : quantityPercentage! < 0 ? (
                    <CustomTrendingDownIcon />
                  ) : null}
                  {formatPercentageDifference(quantityPercentage!)}{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    vs {previousPeriodLabel}
                  </Typography>
                </Typography>
              )
            ) : null}
          </CardOverview>
        </Grid>
      </Grid>

      {/* Overview Items */}
      <Grid container spacing={2} size={12}>
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <CardOverview>
            <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
              <SellIcon color="primary" />
              <Typography>Paling Laku</Typography>
            </BoxFlex>

            <Box>
              <TypographyTab variant="body2">
                {`Nama Item\t\t: `}
                {isLoadingOverviewItems ? (
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={120}
                    height={20}
                  />
                ) : (
                  dataOverviewItems?.mostSellItemsName || "-"
                )}
              </TypographyTab>
              <TypographyTab variant="body2">
                {`Jumlah\t\t\t: `}
                {isLoadingOverviewItems ? (
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={32}
                    height={20}
                  />
                ) : dataOverviewItems?.mostSellItemsAmount ? (
                  numberFormat.format(dataOverviewItems?.mostSellItemsAmount)
                ) : (
                  "-"
                )}
              </TypographyTab>
              <TypographyTab variant="body2">
                {`Terakhir Terjual\t: `}
                {isLoadingOverviewItems ? (
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={120}
                    height={20}
                  />
                ) : dataOverviewItems?.mostSellItemsLatestSold ? (
                  formatLocalDate(dataOverviewItems?.mostSellItemsLatestSold)
                ) : (
                  "-"
                )}
              </TypographyTab>
            </Box>
          </CardOverview>
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <CardOverview>
            <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
              <SellIcon color="error" />
              <Typography>Paling Tidak Laku</Typography>
            </BoxFlex>
            <Box>
              <TypographyTab variant="body2">
                {`Nama Item\t\t: `}
                {isLoadingOverviewItems ? (
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={120}
                    height={20}
                  />
                ) : (
                  dataOverviewItems?.leastSellItemsName || "-"
                )}
              </TypographyTab>
              <TypographyTab variant="body2">
                {`Jumlah\t\t\t: `}
                {isLoadingOverviewItems ? (
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={120}
                    height={20}
                  />
                ) : dataOverviewItems?.leastSellItemsAmount ? (
                  numberFormat.format(dataOverviewItems?.leastSellItemsAmount)
                ) : (
                  "-"
                )}
              </TypographyTab>
              <TypographyTab variant="body2">
                {`Terakhir Terjual\t: `}
                {isLoadingOverviewItems ? (
                  <Skeleton
                    component="span"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                    width={120}
                    height={20}
                  />
                ) : dataOverviewItems?.leastSellItemsLatestSold ? (
                  formatLocalDate(dataOverviewItems?.leastSellItemsLatestSold)
                ) : (
                  "-"
                )}
              </TypographyTab>
            </Box>
          </CardOverview>
        </Grid>
      </Grid>
    </Grid>
  );
}
