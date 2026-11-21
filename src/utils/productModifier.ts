import { userOrganizationRole } from "@/constants/user";
import { OrganizationUserRole } from "@/types/organizationUser";

interface SelectionRule {
  isRequired: boolean;
  isMultiple: boolean;
  minSelection: number;
  maxSelection: number;
}

export function formatSelectionRule({
  isMultiple,
  minSelection,
  maxSelection,
}: SelectionRule): string {
  if (!isMultiple) {
    return "Pilih maksimal 1 opsi";
  }

  if (minSelection === maxSelection) {
    return `Pilih tepat ${minSelection} opsi`;
  }

  if (minSelection === 0) {
    return `Pilih maksimal ${maxSelection} opsi`;
  }

  return `Pilih ${minSelection}–${maxSelection} opsi`;
}

export function formatSelectionMode(isRequired: boolean): string {
  return isRequired ? "Wajib" : "Opsional";
}

export function formatSelectionSummary(rule: SelectionRule): string {
  return `${formatSelectionMode(rule.isRequired)} · ${formatSelectionRule(rule)}`;
}

export function areSameIds(first: string[], second: string[]): boolean {
  if (first.length !== second.length) return false;

  const firstSorted = [...first].sort();
  const secondSorted = [...second].sort();

  return firstSorted.every((id, index) => id === secondSorted[index]);
}

export function canManageProductModifiers(
  role?: OrganizationUserRole,
): boolean {
  return (
    role === userOrganizationRole.OWNER ||
    role === userOrganizationRole.ADMIN
  );
}
