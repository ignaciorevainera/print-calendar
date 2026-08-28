import { CalendarLocale, WeekStart } from '../types';

const LOCALE_TAG_MAP: Record<CalendarLocale, string> = {
  es: 'es-ES',
  en: 'en-US',
  pt: 'pt-BR',
  fr: 'fr-FR',
};

export const LOCALE_OPTIONS: { id: CalendarLocale; name: string; tag: string }[] = [
  { id: 'es', name: 'Español', tag: 'es-ES' },
  { id: 'en', name: 'English', tag: 'en-US' },
  { id: 'pt', name: 'Português', tag: 'pt-BR' },
  { id: 'fr', name: 'Français', tag: 'fr-FR' },
];

export function getMonthNames(locale: CalendarLocale): string[] {
  const tag = LOCALE_TAG_MAP[locale];
  const formatter = new Intl.DateTimeFormat(tag, { month: 'long' });
  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2000, i, 1)).toUpperCase()
  );
}

export function getDayLetters(locale: CalendarLocale, weekStart: WeekStart): string[] {
  const tag = LOCALE_TAG_MAP[locale];
  const formatter = new Intl.DateTimeFormat(tag, { weekday: 'narrow' });
  const base = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2024, 0, i + 1);
    return formatter.format(date).toUpperCase();
  });
  if (weekStart === 'sunday') {
    const sunday = base.pop()!;
    base.unshift(sunday);
  }
  return base;
}
