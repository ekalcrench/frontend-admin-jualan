import { boxShadowCard } from "@/constants/styled";
import { Card, CardProps, styled } from "@mui/material";

export const CardOverview = styled(Card)<CardProps>(() => ({
  boxShadow: boxShadowCard,
  padding: "20px 16px",
}));

export const CardBalance = styled(Card)<CardProps>(
  ({ theme: { palette } }) => ({
    background: `linear-gradient(
      135deg,
      ${palette.secondary.dark} 0%,
      ${palette.secondary.light} 100%
    )`,
    boxShadow: boxShadowCard,
    color: "white",
    padding: "20px 16px",
  }),
);
