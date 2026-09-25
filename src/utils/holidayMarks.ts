import { HolidayItem, MarkedDaysMap } from '../types';
import { isValidHolidayDate, parseHolidayDate } from '../services/holidayApi';

const LABEL_SEPARATOR = ' · ';

export function countDistinctHolidayDays(holidays: HolidayItem[]): number {
  const dayKeys = holidays
    .filter((holiday) => isValidHolidayDate(holiday.date))
    .map((holiday) => parseHolidayDate(holiday.date).dayKey);
  return new Set(dayKeys).size;
}

export function buildHolidayMarks(holidays: HolidayItem[], color: string): MarkedDaysMap {
  const marks: MarkedDaysMap = {};

  for (const holiday of holidays) {
    if (!isValidHolidayDate(holiday.date)) continue;
    const { dayKey } = parseHolidayDate(holiday.date);
    const name = holiday.localName || holiday.name;
    const existing = marks[dayKey];

    if (existing) {
      const labels = (existing.label ?? '').split(LABEL_SEPARATOR).filter(Boolean);
      if (name && !labels.includes(name)) {
        existing.label = [...labels, name].join(LABEL_SEPARATOR);
      }
      continue;
    }

    marks[dayKey] = {
      color,
      label: name || undefined,
      isHoliday: true,
    };
  }

  return marks;
}
