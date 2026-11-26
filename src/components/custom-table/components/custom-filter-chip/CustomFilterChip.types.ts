export interface CustomFilterChipProps<Value extends string> {
  label: string;
  value?: Value;
  options: { label: string; value?: Value }[];
  onChange(value?: Value): void;
}
