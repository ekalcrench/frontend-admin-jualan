import { Grid, Typography, Skeleton } from "@mui/material";
import useCashDetails from "./CashDetails.hooks";
import { currencyFormatter } from "@/utils/currency";
import { CashDetailsCard } from "./CashDetails.styles";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { BoxFlex } from "@/styled/CustomBox";
import SavingsIcon from "@mui/icons-material/Savings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export default function CashDetails() {
  const { data, isLoading } = useCashDetails();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <CashDetailsCard>
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
                : currencyFormatter.format(data?.remainingCash ?? 0)}
            </Typography>
          )}
        </CashDetailsCard>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <CashDetailsCard>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <SavingsIcon />
            <Typography>Cash masuk</Typography>
          </BoxFlex>
          {isLoading ? (
            <Skeleton variant="rounded" width={160} height={32} />
          ) : (
            <Typography variant="h5">
              {data === undefined
                ? "-"
                : currencyFormatter.format(data?.cashIn ?? 0)}
            </Typography>
          )}
        </CashDetailsCard>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <CashDetailsCard>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <ShoppingCartIcon />
            <Typography>Cash keluar</Typography>
          </BoxFlex>
          {isLoading ? (
            <Skeleton variant="rounded" width={160} height={32} />
          ) : (
            <Typography variant="h5">
              {data === undefined
                ? "-"
                : currencyFormatter.format(data?.cashOut ?? 0)}
            </Typography>
          )}
        </CashDetailsCard>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <CashDetailsCard>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <MonetizationOnIcon />
            <Typography>Keuntungan</Typography>
          </BoxFlex>
          {isLoading ? (
            <Skeleton variant="rounded" width={160} height={32} />
          ) : (
            <Typography variant="h5">
              {data === undefined
                ? "-"
                : currencyFormatter.format(data?.netCashFlow ?? 0)}
            </Typography>
          )}
        </CashDetailsCard>
      </Grid>
    </Grid>
  );
}
