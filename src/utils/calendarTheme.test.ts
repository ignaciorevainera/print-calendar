import { describe, expect, it } from 'vitest';
import { customCalendarOverrides } from './calendarTheme';

describe('customCalendarOverrides', () => {
  it('devuelve vacío sin color personalizado', () => {
    expect(customCalendarOverrides('', 'gris')).toEqual({});
  });

  it('aplica contraste oscuro sobre fondo oscuro', () => {
    const overrides = customCalendarOverrides('#1e293b', 'gris');
    expect(overrides['--cal-bg']).toBe('#1e293b');
    expect(overrides['--cal-text']).toBe('#ffffff');
    expect(overrides['--cal-weekend-bg']).toBe('#1e293b');
  });

  it('propaga el fondo a las tarjetas con paleta clara', () => {
    expect(customCalendarOverrides('#fefce8', 'gris')).toEqual({
      '--cal-bg': '#fefce8',
    });
  });

  it('usa variables nocturno sobre fondo claro con paleta nocturno', () => {
    const overrides = customCalendarOverrides('#fefce8', 'nocturno');
    expect(overrides['--cal-bg']).toBe('#fefce8');
    expect(overrides['--cal-text']).toBe('#1e293b');
  });
});
