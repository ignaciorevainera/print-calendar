import { RecurrenceOptions, MarkedDaysMap } from '../types';

export function calculateRecurringDays(
  year: number,
  monthIndex: number,
  dayNumber: number,
  options: RecurrenceOptions,
  existingMarkedDays: MarkedDaysMap = {}
): string[] {
  const result: string[] = [];
  const targetDate = new Date(year, monthIndex, dayNumber);
  const targetDayOfWeek = targetDate.getDay();

  if (options.pattern === 'none') {
    result.push(`${monthIndex + 1}-${dayNumber}`);
  } else if (options.pattern === 'weekday_month') {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, monthIndex, d);
      if (date.getDay() === targetDayOfWeek) {
        result.push(`${monthIndex + 1}-${d}`);
      }
    }
  } else if (options.pattern === 'weekday_year') {
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, m, d);
        if (date.getDay() === targetDayOfWeek) {
          result.push(`${m + 1}-${d}`);
        }
      }
    }
  } else if (options.pattern === 'day_of_month') {
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      if (dayNumber <= daysInMonth) {
        result.push(`${m + 1}-${dayNumber}`);
      }
    }
  } else if (options.pattern === 'custom_range') {
    let end: Date;
    if (options.endDate) {
      const parts = options.endDate.split('-').map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        end = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        end = new Date(options.endDate);
      }
    } else {
      end = new Date(year, 11, 31);
    }
    let curr = new Date(year, monthIndex, dayNumber);
    while (curr <= end && curr.getFullYear() === year) {
      if (curr.getDay() === targetDayOfWeek) {
        result.push(`${curr.getMonth() + 1}-${curr.getDate()}`);
      }
      curr.setDate(curr.getDate() + 7);
    }
  }

  if (!options.overwriteExisting) {
    return result.filter((key) => !existingMarkedDays[key]);
  }

  return result;
}
