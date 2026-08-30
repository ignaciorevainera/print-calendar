export type PaletteKey = 
  | 'gris' 
  | 'monocromo' 
  | 'azul' 
  | 'oliva' 
  | 'terracota'
  | 'esmeralda'
  | 'purpura'
  | 'rosa'
  | 'amber'
  | 'marino'
  | 'nocturno';

export interface PaletteOption {
  id: PaletteKey;
  name: string;
  className: string;
  colorSwatch: string;
}

export type FontFamilyKey = 'jakarta' | 'inter' | 'playfair' | 'roboto' | 'lora' | 'fira' | 'jetbrains';

export interface FontOption {
  id: FontFamilyKey;
  name: string;
  fontClass: string;
  fontStyleName: string;
}

export type WeekStart = 'monday' | 'sunday';

export type LayoutType = 'anual' | 'semestral' | 'trimestral' | 'mensual';

export type RecurrencePattern =
  | 'none'
  | 'weekday_month'
  | 'weekday_year'
  | 'day_of_month'
  | 'custom_range';

export interface RecurrenceOptions {
  pattern: RecurrencePattern;
  endDate?: string;
  overwriteExisting: boolean;
}

export interface MarkedDayInfo {
  color: string;
  label?: string;
  note?: string;
  isHoliday?: boolean;
  seriesId?: string;
}

export type MarkedDaysMap = Record<string, MarkedDayInfo>;

export interface HolidayItem {
  date: string; // "2027-01-01"
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties: string[] | null;
  types?: string[];
}

export interface AvailableCountry {
  countryCode: string;
  name: string;
  spanishName?: string;
}

export interface MonthInfo {
  monthIndex: number; // 0 to 11
  name: string;
  shortName: string;
  daysInMonth: number;
  startDayOfWeek: number; // 0 (Sun) - 6 (Sat)
  weeks: (number | null)[][];
}

export type HeaderTitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type MonthTitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type DayNumberSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type DayTextSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export const SIZE_OPTIONS: { id: HeaderTitleSize; name: string }[] = [
  { id: 'sm', name: 'Pequeño' },
  { id: 'md', name: 'Normal' },
  { id: 'lg', name: 'Grande' },
  { id: 'xl', name: 'Extra Grande' },
  { id: '2xl', name: '2X Grande' },
  { id: '3xl', name: '3X Grande' },
];

export type DayNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface MonthRange {
  start: number; // 1 to 12
  end: number;   // 1 to 12
}

export type CalendarLocale = 'es' | 'en' | 'pt' | 'fr';

