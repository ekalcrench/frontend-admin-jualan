import { IconButton, TextField } from "@mui/material";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { CustomSearchInputProps } from "./CustomSearchInput.types";
import SearchIcon from "@mui/icons-material/Search";

export default function CustomSearchInput({
  value,
  onSearch,
  debounceMs = 3000,
  searchPlaceholder = "Search",
}: CustomSearchInputProps) {
  const [inputValue, setInputValue] = useState<string>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    timeoutRef.current = setTimeout(
      () => onSearchRef.current(inputValue),
      debounceMs,
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [debounceMs, inputValue]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch(inputValue);
  };

  const handleClickSearch = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch(inputValue);
  };

  return (
    <TextField
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={searchPlaceholder}
      size="small"
      variant="outlined"
      slotProps={{
        input: {
          endAdornment: (
            <IconButton edge="end" onClick={handleClickSearch} color="primary">
              <SearchIcon />
            </IconButton>
          ),
        },
      }}
      sx={{ minWidth: "360px", "& input": { height: "48px" } }}
    />
  );
}
