export function monthIndexFromName(monthName: string, monthNames: readonly string[]): number | null {
  const index = monthNames.indexOf(monthName);
  return index === -1 ? null : index;
}
