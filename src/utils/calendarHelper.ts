import { MonthInfo, WeekStart, LayoutType, CalendarLocale } from '../types';
import { getMonthNames } from './i18n';

export const SPANISH_MONTH_NAMES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE'
];

export const DAYS_MONDAY_START = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export const DAYS_SUNDAY_START = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export function isWeekendIndex(index: number, weekStart: WeekStart): boolean {
  if (weekStart === 'monday') {
    // 0:L, 1:M, 2:X, 3:J, 4:V, 5:S, 6:D -> 5 and 6 are weekend
    return index === 5 || index === 6;
  } else {
    // 0:D, 1:L, 2:M, 3:X, 4:J, 5:V, 6:S -> 0 and 6 are weekend
    return index === 0 || index === 6;
  }
}

export function generateYearData(year: number = 2027, weekStart: WeekStart = 'monday', locale: CalendarLocale = 'es'): MonthInfo[] {
  const months: MonthInfo[] = [];
  const monthNames = getMonthNames(locale);

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const firstDayDate = new Date(year, monthIndex, 1);
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    
    // JS getDay(): 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const jsDayOfWeek = firstDayDate.getDay();

    let offset = 0;
    if (weekStart === 'monday') {
      // If Sunday (0), offset is 6. If Monday (1), offset is 0.
      offset = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;
    } else {
      // Sunday is 0, Monday is 1, ..., Saturday is 6
      offset = jsDayOfWeek;
    }

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    // Fill leading empty cells
    for (let i = 0; i < offset; i++) {
      currentWeek.push(null);
    }

    // Fill days of the month
    for (let day = 1; day <= totalDays; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill trailing empty cells if any
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Ensure uniform 6 rows across all months for consistent grid alignment
    while (weeks.length < 6) {
      weeks.push([null, null, null, null, null, null, null]);
    }

    months.push({
      monthIndex,
      name: monthNames[monthIndex],
      shortName: monthNames[monthIndex].substring(0, 3),
      daysInMonth: totalDays,
      startDayOfWeek: jsDayOfWeek,
      weeks
    });
  }

  return months;
}

export function chunkMonths(months: MonthInfo[], layout: LayoutType): MonthInfo[][] {
  let chunkSize = 12;
  if (layout === 'semestral') chunkSize = 6;
  if (layout === 'trimestral') chunkSize = 3;
  if (layout === 'mensual') chunkSize = 1;

  const chunks: MonthInfo[][] = [];
  for (let i = 0; i < months.length; i += chunkSize) {
    chunks.push(months.slice(i, i + chunkSize));
  }
  return chunks;
}

