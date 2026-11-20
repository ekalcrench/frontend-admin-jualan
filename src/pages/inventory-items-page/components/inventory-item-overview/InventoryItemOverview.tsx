import { Grid, Typography, Skeleton } from "@mui/material";
import useInventoryItemOverview from "./InventoryItemOverview.hooks";
import { currencyFormatter } from "@/utils/currency";
import { BoxFlex } from "@/styled/CustomBox";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { CardBalance } from "@/styled/CustomCard";

export default function InventoryItemOverview() {
  const { data, isLoading } = useInventoryItemOverview();

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4, xl: 3 }}>
        <CardBalance>
          <BoxFlex sx={{ marginBottom: "12px", gap: "8px" }}>
            <AccountBalanceIcon />
            <Typography>Total nilai assets</Typography>
          </BoxFlex>
          {isLoading ? (
            <Skeleton variant="rounded" width={160} height={32} />
          ) : (
            <Typography variant="h5">
              {data === undefined
                ? "-"
                : currencyFormatter.format(data?.totalAssets ?? 0)}
            </Typography>
          )}
        </CardBalance>
      </Grid>
    </Grid>
  );
}
