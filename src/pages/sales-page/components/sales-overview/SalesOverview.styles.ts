import { boxShadowCard } from "@/constants/styled";
import { Card, CardProps, styled } from "@mui/material";

export const SalesOverviewCard = styled(Card)<CardProps>(() => ({
  boxShadow: boxShadowCard,
  padding: "20px 16px",
}));
