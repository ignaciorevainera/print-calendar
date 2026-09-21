import { MarkedDaysMap } from '../types';

export function removeDayMark(markedDays: MarkedDaysMap, dayKey: string): MarkedDaysMap {
  const next = { ...markedDays };
  delete next[dayKey];
  return next;
}

export function removeSeriesMarks(
  markedDays: MarkedDaysMap,
  seriesId: string,
): { markedDays: MarkedDaysMap; removedCount: number } {
  const next: MarkedDaysMap = {};
  let removedCount = 0;

  for (const [key, value] of Object.entries(markedDays)) {
    if (value.seriesId === seriesId) {
      removedCount += 1;
    } else {
      next[key] = value;
    }
  }

  return { markedDays: next, removedCount };
}
