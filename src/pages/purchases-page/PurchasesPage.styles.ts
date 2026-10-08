import { Stack, StackProps, styled } from "@mui/material";

export const StackDetailPanel = styled(Stack)<StackProps>(
  ({ theme: { palette } }) => ({
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    borderWidth: "2px",
    borderStyle: "dashed",
    borderColor: palette.common.black,
    borderRadius: "4px",
    padding: "12px 16px",
  }),
);
