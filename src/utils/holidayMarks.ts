import { HolidayItem, MarkedDaysMap } from '../types';
import { parseHolidayDate } from '../services/holidayApi';

const LABEL_SEPARATOR = ' · ';

export function countDistinctHolidayDays(holidays: HolidayItem[]): number {
  return new Set(holidays.map((holiday) => parseHolidayDate(holiday.date).dayKey)).size;
}

export function buildHolidayMarks(holidays: HolidayItem[], color: string): MarkedDaysMap {
  const marks: MarkedDaysMap = {};

  for (const holiday of holidays) {
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
