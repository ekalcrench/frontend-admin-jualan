import { Box, IconButton, Typography } from "@mui/material";
import { FormDrawerProps } from "./FormDrawer.types";
import { CustomFormDrawer } from "./FormDrawer.styles";
import CloseIcon from "@mui/icons-material/Close";

export default function FormDrawer({
  title,
  disableCloseOnOutsideInteraction,
  onClose,
  children,
  formProps,
  footer,
  ...drawerProps
}: FormDrawerProps) {
  return (
    <CustomFormDrawer
      {...drawerProps}
      anchor="right"
      onClose={disableCloseOnOutsideInteraction ? () => {} : onClose}
    >
      <Box
        component="form"
        {...formProps}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            paddingX: { xs: "16px", sm: "24px" },
          }}
        >
          <Typography variant="h6">{title}</Typography>

          <IconButton
            type="button"
            aria-label="Close drawer"
            onClick={(e) => onClose?.(e)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: { xs: "16px", sm: "24px" },
          }}
        >
          {children}
        </Box>

        {footer && (
          <Box
            sx={{
              flexShrink: 0,
              paddingTop: "16px",
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "background.default",
              paddingX: { xs: "16px", sm: "24px" },
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </CustomFormDrawer>
  );
}
