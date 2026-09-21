import { PaletteKey } from '../types';
import { getContrastTextColor } from './colorHelper';

export function customCalendarOverrides(
  calendarBgColor: string,
  palette: PaletteKey,
): Record<string, string> {
  if (!calendarBgColor) return {};
  if (getContrastTextColor(calendarBgColor) === '#ffffff') {
    return {
      '--cal-bg': calendarBgColor,
      '--cal-text': '#ffffff',
      '--cal-muted': '#94a3b8',
      '--cal-accent': '#38bdf8',
      '--cal-border': '#334155',
      '--cal-grid-border': '#334155',
      '--cal-weekend': '#e2e8f0',
      '--cal-weekend-bg': '#1e293b',
    };
  }
  if (palette === 'nocturno') {
    return {
      '--cal-bg': calendarBgColor,
      '--cal-text': '#1e3a8a',
      '--cal-muted': '#64748b',
      '--cal-accent': '#1e40af',
      '--cal-border': '#cbd5e1',
      '--cal-grid-border': '#e2e8f0',
      '--cal-weekend': '#1e3a8a',
      '--cal-weekend-bg': '#f0f9ff',
    };
  }
  return { '--cal-bg': calendarBgColor };
}
