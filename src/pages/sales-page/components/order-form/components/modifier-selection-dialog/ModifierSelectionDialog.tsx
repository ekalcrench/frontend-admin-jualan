import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { currencyFormatter } from "@/utils/currency";
import {
  formatSelectionMode,
  formatSelectionRule,
} from "@/utils/productModifier";
import type { ProductModifierGroupOnProduct } from "@/types/productModifier";
import type { ModifierSelectionDialogProps } from "./ModifierSelectionDialog.types";

function getSelectionError(
  group: ProductModifierGroupOnProduct,
  selectedIds: string[],
): string | null {
  const minimum = group.isRequired
    ? Math.max(1, group.minSelection)
    : group.minSelection;

  if (selectedIds.length < minimum) {
    return minimum === 1
      ? "Pilih 1 opsi untuk melanjutkan."
      : `Pilih minimal ${minimum} opsi untuk melanjutkan.`;
  }
  if (selectedIds.length > group.maxSelection) {
    return `Pilih maksimal ${group.maxSelection} opsi.`;
  }
  if (!group.isMultiple && selectedIds.length > 1) {
    return "Grup ini hanya mengizinkan satu pilihan.";
  }

  return null;
}

export default function ModifierSelectionDialog(
  props: ModifierSelectionDialogProps,
) {
  const [selectedByGroup, setSelectedByGroup] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    if (!props.open) return;

    const next: Record<string, string[]> = {};
    for (const group of props.groups) {
      const selected = group.options
        .filter((option) => props.initialOptionIds.includes(option.id))
        .map((option) => option.id);
      if (selected.length) next[group.id] = selected;
    }
    setSelectedByGroup(next);
  }, [props.open, props.groups, props.initialOptionIds]);

  const selectedOptions = useMemo(
    () =>
      props.groups.flatMap((group) =>
        group.options
          .filter((option) =>
            (selectedByGroup[group.id] ?? []).includes(option.id),
          )
          .map((option) => ({ group, option })),
      ),
    [props.groups, selectedByGroup],
  );

  const validationErrors = useMemo(
    () =>
      props.groups.reduce<Record<string, string>>((errors, group) => {
        const error = getSelectionError(
          group,
          selectedByGroup[group.id] ?? [],
        );
        if (error) errors[group.id] = error;
        return errors;
      }, {}),
    [props.groups, selectedByGroup],
  );

  const isValid = Object.keys(validationErrors).length === 0;
  const modifierTotal = selectedOptions.reduce(
    (total, { option }) => total + option.price,
    0,
  );
  const unitTotal = props.basePrice + modifierTotal;

  const handleToggleOption = (
    group: ProductModifierGroupOnProduct,
    optionId: string,
  ) => {
    setSelectedByGroup((previous) => {
      const current = previous[group.id] ?? [];

      if (current.includes(optionId)) {
        return {
          ...previous,
          [group.id]: current.filter((id) => id !== optionId),
        };
      }

      if (current.length >= group.maxSelection) {
        return previous;
      }

      return {
        ...previous,
        [group.id]: [...current, optionId],
      };
    });
  };

  const handleSelectSingle = (groupId: string, optionId: string) => {
    setSelectedByGroup((previous) => ({
      ...previous,
      [groupId]: optionId ? [optionId] : [],
    }));
  };

  const handleConfirm = () => {
    if (!isValid) return;

    props.onConfirm({
      optionIds: selectedOptions.map(({ option }) => option.id),
      modifiers: selectedOptions.map(({ group, option }) => ({
        modifierGroupId: group.id,
        modifierOptionId: option.id,
        groupName: group.name,
        optionName: option.name,
        unitPrice: option.price,
      })),
      unitTotal,
    });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
    >
      <DialogTitle sx={{ paddingBottom: "8px" }}>
        Pilih Variasi Produk
      </DialogTitle>

      <DialogContent dividers>
        <BoxFlexSpaceBetween
          sx={{ alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600 }}>
              {props.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Harga dasar {currencyFormatter.format(props.basePrice)}
            </Typography>
          </Box>
        </BoxFlexSpaceBetween>

        <Divider sx={{ marginY: "16px" }} />

        <Stack spacing={3}>
          {props.groups.map((group) => {
            const selectedIds = selectedByGroup[group.id] ?? [];
            const error = validationErrors[group.id];

            return (
              <Box key={group.id}>
                <BoxFlexSpaceBetween
                  sx={{ alignItems: "flex-start", gap: "12px" }}
                >
                  <Box>
                    <BoxFlex sx={{ gap: "8px", flexWrap: "wrap" }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {group.name}
                      </Typography>
                      <Chip
                        label={formatSelectionMode(group.isRequired)}
                        size="small"
                        variant="outlined"
                        color={group.isRequired ? "primary" : "default"}
                      />
                    </BoxFlex>
                    <Typography variant="body2" color="text.secondary">
                      {formatSelectionRule(group)}
                    </Typography>
                    {group.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginTop: "2px" }}
                      >
                        {group.description}
                      </Typography>
                    )}
                  </Box>
                </BoxFlexSpaceBetween>

                <Box sx={{ marginTop: "4px" }}>
                  {group.isMultiple ? (
                    <Stack>
                      {group.options.map((option) => {
                        const checked = selectedIds.includes(option.id);
                        const maxReached =
                          selectedIds.length >= group.maxSelection;

                        return (
                          <FormControlLabel
                            key={option.id}
                            sx={{
                              alignItems: "flex-start",
                              marginY: "2px",
                              "& .MuiFormControlLabel-label": { flex: 1 },
                            }}
                            control={
                              <Checkbox
                                checked={checked}
                                disabled={!checked && maxReached}
                                onChange={() =>
                                  handleToggleOption(group, option.id)
                                }
                              />
                            }
                            label={
                              <BoxFlexSpaceBetween
                                sx={{ width: "100%", gap: "12px" }}
                              >
                                <Typography variant="body2">
                                  {option.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ whiteSpace: "nowrap" }}
                                >
                                  {option.price === 0
                                    ? "Gratis"
                                    : `+${currencyFormatter.format(option.price)}`}
                                </Typography>
                              </BoxFlexSpaceBetween>
                            }
                          />
                        );
                      })}
                    </Stack>
                  ) : (
                    <RadioGroup
                      value={selectedIds[0] ?? ""}
                      onChange={(event) =>
                        handleSelectSingle(group.id, event.target.value)
                      }
                    >
                      {!group.isRequired && group.minSelection === 0 && (
                        <FormControlLabel
                          value=""
                          control={<Radio />}
                          label={
                            <Typography variant="body2">
                              Tidak memilih
                            </Typography>
                          }
                        />
                      )}
                      {group.options.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          sx={{
                            alignItems: "flex-start",
                            marginY: "2px",
                            "& .MuiFormControlLabel-label": { flex: 1 },
                          }}
                          control={<Radio />}
                          label={
                            <BoxFlexSpaceBetween
                              sx={{ width: "100%", gap: "12px" }}
                            >
                              <Typography variant="body2">
                                {option.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                {option.price === 0
                                  ? "Gratis"
                                  : `+${currencyFormatter.format(option.price)}`}
                              </Typography>
                            </BoxFlexSpaceBetween>
                          }
                        />
                      ))}
                    </RadioGroup>
                  )}

                  {group.options.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Belum ada opsi aktif untuk grup ini.
                    </Typography>
                  )}

                  {error && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ marginTop: "4px" }}
                    >
                      {error}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ marginTop: "16px" }} />
              </Box>
            );
          })}
        </Stack>

        <Box
          sx={{
            marginTop: "20px",
            padding: "12px 16px",
            border: "1px solid",
            borderColor: "border.main",
            borderRadius: "12px",
            backgroundColor: "background.default",
          }}
        >
          <BoxFlexSpaceBetween>
            <Typography variant="body2" color="text.secondary">
              Harga dasar
            </Typography>
            <Typography variant="body2">
              {currencyFormatter.format(props.basePrice)}
            </Typography>
          </BoxFlexSpaceBetween>
          <BoxFlexSpaceBetween>
            <Typography variant="body2" color="text.secondary">
              Total variasi
            </Typography>
            <Typography variant="body2">
              {modifierTotal === 0
                ? "Gratis"
                : `+${currencyFormatter.format(modifierTotal)}`}
            </Typography>
          </BoxFlexSpaceBetween>
          <Divider sx={{ marginY: "8px" }} />
          <BoxFlexSpaceBetween>
            <Typography sx={{ fontWeight: 700 }}>Harga Satuan</Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {currencyFormatter.format(unitTotal)}
            </Typography>
          </BoxFlexSpaceBetween>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button variant="text" onClick={props.onClose}>
          Batal
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!isValid || props.groups.length === 0}
        >
          Simpan Variasi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
