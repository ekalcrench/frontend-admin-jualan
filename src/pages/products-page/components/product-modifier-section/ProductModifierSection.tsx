import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { BoxFlex } from "@/styled/CustomBox";
import {
  formatSelectionMode,
  formatSelectionRule,
} from "@/utils/productModifier";
import type { ProductModifierSectionProps } from "./ProductModifierSection.types";

export default function ProductModifierSection({
  options,
  selectedIds,
  onChange,
  isLoading,
  isError,
  onRetry,
  disabled,
}: ProductModifierSectionProps) {
  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id),
  );

  return (
    <Box>
      <Typography sx={{ fontWeight: 600, marginBottom: "4px" }}>
        Variasi & Add-on
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: "16px" }}
      >
        Tambahkan pilihan variasi atau add-on yang dapat dipilih pelanggan saat
        memesan
      </Typography>

      {isError ? (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "error.light",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Typography variant="body2" color="error">
            Gagal memuat daftar grup variasi.
          </Typography>
          <Button
            size="small"
            variant="text"
            onClick={onRetry}
            sx={{ marginTop: "4px" }}
          >
            Coba Lagi
          </Button>
        </Box>
      ) : (
        <>
          <Autocomplete
            multiple
            disableCloseOnSelect
            disableClearable
            options={options}
            value={selectedOptions}
            onChange={(_event, value) =>
              onChange(value.map((option) => option.id))
            }
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={isLoading}
            disabled={disabled}
            loadingText="Memuat grup variasi..."
            noOptionsText="Belum ada grup variasi aktif"
            renderOption={(optionProps, option, state) => {
              const { key, ...restProps } = optionProps;

              return (
                <Box
                  component="li"
                  key={key}
                  {...restProps}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "4px",
                    padding: "8px 12px",
                  }}
                >
                  <Checkbox
                    checked={state.selected}
                    size="small"
                    disableRipple
                    tabIndex={-1}
                    sx={{ padding: "6px", marginTop: "2px" }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <BoxFlex sx={{ gap: "6px", flexWrap: "wrap" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      {!option.isActive && (
                        <Chip
                          label="Nonaktif"
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {option.isMultiple && (
                        <Chip
                          label="Pilihan ganda"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </BoxFlex>
                    <Typography variant="caption" color="text.secondary">
                      {formatSelectionMode(option.isRequired)} ·{" "}
                      {formatSelectionRule(option)}
                      {typeof option.optionsCount === "number" &&
                        ` · ${option.optionsCount} opsi`}
                    </Typography>
                  </Box>
                </Box>
              );
            }}
            renderValue={(value, getItemProps) =>
              value.map((option, index) => {
                const { key, ...itemProps } = getItemProps({ index });

                return (
                  <Chip
                    key={key}
                    {...itemProps}
                    size="small"
                    variant="outlined"
                    label={`${option.name}${
                      option.isRequired ? " · Wajib" : ""
                    }${option.isMultiple ? " · Ganda" : ""}`}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  selectedOptions.length
                    ? ""
                    : "Pilih grup variasi untuk produk ini"
                }
              />
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "auto !important",
                minHeight: "54px",
                padding: "6px 40px 6px 8px !important",
                alignItems: "center",
              },
              "& .MuiAutocomplete-input": {
                height: "32px !important",
                padding: "0 4px !important",
              },
              "& .MuiAutocomplete-tag": {
                margin: "2px",
              },
            }}
          />
        </>
      )}
    </Box>
  );
}
