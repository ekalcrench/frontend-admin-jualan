import { IconButton, Typography } from "@mui/material";
import { FormDrawerProps } from "./FormDrawer.types";
import { CustomFormDrawer } from "./FormDrawer.styles";
import CloseIcon from "@mui/icons-material/Close";

export default function FormDrawer({
  title,
  disableCloseOnOutsideInteraction,
  onClose,
  ...props
}: FormDrawerProps) {
  return (
    <CustomFormDrawer
      {...props}
      anchor="right"
      onClose={disableCloseOnOutsideInteraction ? () => {} : onClose}
    >
      <Typography variant="h6" sx={{ marginBottom: "32px" }}>
        {title}
      </Typography>

      <IconButton
        sx={{ position: "absolute", top: "16px", right: "16px" }}
        onClick={(e) => onClose?.(e)}
      >
        <CloseIcon />
      </IconButton>

      {props.children}
    </CustomFormDrawer>
  );
}
