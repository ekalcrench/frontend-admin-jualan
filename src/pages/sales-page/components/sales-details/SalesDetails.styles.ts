import { boxShadowCard } from "@/constants/styled";
import { Card, CardProps, styled } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

export const SalesDetailsCard = styled(Card)<CardProps>(
  ({ theme: { palette } }) => ({
    boxShadow: boxShadowCard,
    padding: "20px 16px",
  }),
);

export const CustomTrendingUpIcon = styled(TrendingUpIcon)(
  ({ theme: { palette } }) => ({
    fontSize: "20px",
    verticalAlign: "middle",
    marginRight: "4px",
  }),
);

export const CustomTrendingDownIcon = styled(TrendingDownIcon)(
  ({ theme: { palette } }) => ({
    fontSize: "20px",
    verticalAlign: "middle",
    marginRight: "4px",
  }),
);
