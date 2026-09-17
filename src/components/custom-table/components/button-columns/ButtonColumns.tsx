import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  Typography,
} from "@mui/material";
import { MRT_ColumnDef, MRT_RowData } from "material-react-table";
import { useState } from "react";
import { ButtonColumnsProps } from "./ButtonColumns.types";
import { boxShadowDialog } from "@/constants/styled";

export default function ButtonColumns<TData extends MRT_RowData>({
  columns,
  columnVisibility,
  setColumnVisibility,
}: ButtonColumnsProps<TData>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickHideColumn = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getColumnId = (column: MRT_ColumnDef<TData>) =>
    column.accessorKey ?? column.id;

  const getColumnLabel = (column: MRT_ColumnDef<TData>) =>
    typeof column.header === "string" ? column.header : getColumnId(column);

  return (
    <Box>
      <Button onClick={handleClickHideColumn}>Columns</Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        keepMounted
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              width: "auto",
              maxWidth: "200px",
              boxSizing: "border-box",
              padding: "16px 20px",
              marginTop: "12px",
              boxShadow: boxShadowDialog,
              borderRadius: "12px",
            },
          },
          list: {
            sx: {
              padding: "0px",
            },
          },
        }}
      >
        <Box>
          <Typography sx={{ marginBottom: "8px" }}>
            Pilih kolom yang ingin ditampilkan
          </Typography>
          <Box>
            {columns.map((column) => {
              const columnId = getColumnId(column);
              if (column.enableHiding === false || !columnId) return null;

              return (
                <FormControlLabel
                  key={columnId}
                  label={getColumnLabel(column)}
                  control={
                    <Checkbox
                      checked={columnVisibility[columnId] !== false}
                      onChange={(event) =>
                        setColumnVisibility((previous) => ({
                          ...previous,
                          [columnId]: event.target.checked,
                        }))
                      }
                    />
                  }
                  sx={{ display: "flex" }}
                />
              );
            })}
          </Box>
        </Box>
      </Menu>
    </Box>
  );
}
