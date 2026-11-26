import { useState } from "react";
import { Chip, Menu, MenuItem } from "@mui/material";
import { CustomFilterChipProps } from "./CustomFilterChip.types";

export default function CustomFilterChip<Value extends string>({
  label,
  value,
  options,
  onChange,
}: CustomFilterChipProps<Value>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <>
      <Chip
        label={`${label}: ${selectedLabel ?? "Semua"}`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        variant={value ? "filled" : "outlined"}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { padding: 0 } } }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            selected={option.value === value}
            onClick={() => {
              onChange(option.value);
              setAnchorEl(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
