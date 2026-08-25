export type PaletteKey = 'gris' | 'monocromo' | 'azul' | 'oliva' | 'terracota';

export interface PaletteOption {
  id: PaletteKey;
  name: string;
  className: string;
  colorSwatch: string;
}

export type FontFamilyKey = 'jakarta' | 'inter' | 'playfair';

export interface FontOption {
  id: FontFamilyKey;
  name: string;
  fontClass: string;
  fontStyleName: string;
}

export type WeekStart = 'monday' | 'sunday';

export interface MarkedDayInfo {
  color: string;
  label?: string; // Nombre del festivo o nota
  isHoliday?: boolean;
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
