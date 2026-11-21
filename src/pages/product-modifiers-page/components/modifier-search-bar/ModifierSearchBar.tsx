import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { KeyboardEvent, useEffect, useState } from "react";

interface ModifierSearchBarProps {
  value: string;
  placeholder: string;
  onSearch(value: string): void;
}

export default function ModifierSearchBar({
  value,
  placeholder,
  onSearch,
}: ModifierSearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <TextField
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      size="small"
      variant="outlined"
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Cari"
                edge="end"
                onClick={handleSearch}
                color="primary"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{ "& input": { height: "48px" } }}
    />
  );
}
