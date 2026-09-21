import { describe, expect, it } from 'vitest';
import { customCalendarOverrides } from './calendarTheme';

describe('customCalendarOverrides', () => {
  it('devuelve vacío sin color personalizado', () => {
    expect(customCalendarOverrides('', 'gris')).toEqual({});
  });

  it('aplica contraste oscuro sobre fondo oscuro', () => {
    expect(customCalendarOverrides('#1e293b', 'gris')).toEqual({
      '--cal-bg': '#1e293b',
      '--cal-text': '#ffffff',
      '--cal-muted': '#94a3b8',
      '--cal-accent': '#38bdf8',
      '--cal-border': '#334155',
      '--cal-grid-border': '#334155',
      '--cal-weekend': '#e2e8f0',
      '--cal-weekend-bg': '#1e293b',
    });
  });

  it('propaga el fondo a las tarjetas con paleta clara', () => {
    expect(customCalendarOverrides('#fefce8', 'gris')).toEqual({
      '--cal-bg': '#fefce8',
    });
  });

  it('usa variables nocturno sobre fondo claro con paleta nocturno', () => {
    expect(customCalendarOverrides('#fefce8', 'nocturno')).toEqual({
      '--cal-bg': '#fefce8',
      '--cal-text': '#1e293b',
      '--cal-muted': '#64748b',
      '--cal-accent': '#1e40af',
      '--cal-border': '#cbd5e1',
      '--cal-grid-border': '#e2e8f0',
      '--cal-weekend': '#1e3a8a',
      '--cal-weekend-bg': '#f0f9ff',
    });
  });
});
