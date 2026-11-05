import { Grid, Typography, Skeleton } from "@mui/material";
import useCashDetails from "./CashDetails.hooks";
import { currencyFormatter } from "@/utils/currency";
import { BalanceCard, CashFlowCard } from "./CashDetails.styles";
import { BoxFlex } from "@/styled/CustomBox";
import SavingsIcon from "@mui/icons-material/Savings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { CashDetailsProps } from "./CashDetails.types";
import {
  calculatePercentageDifference,
  formatPercentageDifference,
} from "@/utils/generalUtils";
import {
  formatLocalDate,
  formatLocalDateOnly,
  getPreviousPeriodLabel,
} from "@/utils/dateTime";
import {
  CustomTrendingUpIcon,
  CustomTrendingDownIcon,
} from "@/styled/CustomIcon";

export default function CashDetails(props: CashDetailsProps) {
  const { data, dataCashFlow, isLoading, isLoadingCashFlow } =
    useCashDetails(props);

  const previousPeriodLabel = getPreviousPeriodLabel(
    props.startDate ?? "",
    props.endDate ?? "",
  );
  const cashInPercentage =
    dataCashFlow === undefined
      ? undefined
      : calculatePercentageDifference(
          dataCashFlow.cashIn,
          dataCashFlow.prevCashIn,
        );
  const cashOutPercentage =
    dataCashFlow === undefined
      ? undefined
      : calculatePercentageDifference(
          dataCashFlow.cashOut,
          dataCashFlow.prevCashOut,
        );

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4, xl: 3 }}>
        <BalanceCard>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <AccountBalanceIcon />
            <Typography>Sisa cash</Typography>
          </BoxFlex>
          {isLoading ? (
            <Skeleton variant="rounded" width={160} height={32} />
          ) : (
            <Typography variant="h5">
              {data === undefined
                ? "-"
                : currencyFormatter.format(data?.balance ?? 0)}
            </Typography>
          )}
          {props.endDate && (
            <Typography
              variant="body2"
              sx={{
                marginTop: "4px",
              }}
            >
              {`Hingga ${formatLocalDateOnly(props.endDate)}`}
            </Typography>
          )}
        </BalanceCard>
      </Grid>
      <Grid size={{ xs: 12, md: 4, xl: 3 }}>
        <CashFlowCard>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <SavingsIcon color="success" />
            <Typography>Cash masuk</Typography>
          </BoxFlex>

          {isLoadingCashFlow ? (
            <Skeleton variant="rounded" width={160} height={32} />
          ) : (
            <Typography variant="h5">
              {dataCashFlow === undefined
                ? "-"
                : currencyFormatter.format(dataCashFlow?.cashIn ?? 0)}
            </Typography>
          )}

          {props.startDate && props.endDate ? (
            isLoadingCashFlow ? (
              <Skeleton
                variant="rounded"
                width={160}
                height={16}
                sx={{ marginTop: "4px" }}
              />
            ) : dataCashFlow === undefined ? null : (
              <Typography
                variant="body2"
                sx={{
                  marginTop: "4px",
                  color:
                    cashInPercentage! > 0
                      ? "success.light"
                      : cashInPercentage! < 0
                        ? "error.light"
                        : "inherit",
                }}
              >
                {cashInPercentage! > 0 ? (
                  <CustomTrendingUpIcon />
                ) : cashInPercentage! < 0 ? (
                  <CustomTrendingDownIcon />
                ) : null}
                {formatPercentageDifference(cashInPercentage!)}{" "}
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
        </CashFlowCard>
      </Grid>
      <Grid size={{ xs: 12, md: 4, xl: 3 }}>
        <CashFlowCard>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <ShoppingCartIcon color="error" />
            <Typography>Cash keluar</Typography>
          </BoxFlex>

          {isLoadingCashFlow ? (
            <Skeleton variant="rounded" width={160} height={32} />
          ) : (
            <Typography variant="h5">
              {dataCashFlow === undefined
                ? "-"
                : currencyFormatter.format(dataCashFlow?.cashOut ?? 0)}
            </Typography>
          )}

          {props.startDate && props.endDate ? (
            isLoadingCashFlow ? (
              <Skeleton
                variant="rounded"
                width={160}
                height={16}
                sx={{ marginTop: "4px" }}
              />
            ) : dataCashFlow === undefined ? null : (
              <Typography
                variant="body2"
                sx={{
                  marginTop: "4px",
                  color:
                    cashOutPercentage! > 0
                      ? "success.light"
                      : cashOutPercentage! < 0
                        ? "error.light"
                        : "inherit",
                }}
              >
                {cashOutPercentage! > 0 ? (
                  <CustomTrendingUpIcon />
                ) : cashOutPercentage! < 0 ? (
                  <CustomTrendingDownIcon />
                ) : null}
                {formatPercentageDifference(cashOutPercentage!)}{" "}
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
        </CashFlowCard>
      </Grid>
    </Grid>
  );
}
