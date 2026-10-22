import { boxShadowCard } from "@/constants/styled";
import { Card, CardProps, styled } from "@mui/material";

export const CashDetailsCard = styled(Card)<CardProps>(
  ({ theme: { palette } }) => ({
    background: `linear-gradient(
      135deg,
      ${palette.secondary.main} 0%,
      ${palette.primary.light} 100%
    )`,
    boxShadow: boxShadowCard,
    color: "white",
    padding: "20px 16px",
  }),
);
