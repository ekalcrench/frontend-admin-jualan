import { SortDirection } from "@/types/table";

export function getSortDirection(sortBy: string): SortDirection {
  return sortBy.startsWith("-") ? "desc" : "asc";
}

export function removeSortByDirection(sortBy: string): string {
  if (sortBy.startsWith("-")) {
    return sortBy.substring(1);
  }
  return sortBy;
}
