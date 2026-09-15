export interface CustomSearchInputProps {
  value: string;
  onSearch(value: string): void;
  debounceMs?: number;
}
