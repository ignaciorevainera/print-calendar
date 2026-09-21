import { describe, expect, it } from 'vitest';
import { buildHolidayMarks } from './holidayMarks';
import { HolidayItem } from '../types';

const holiday = (date: string, localName: string): HolidayItem => ({
  date,
  localName,
  name: localName,
  countryCode: 'ES',
  global: true,
  counties: null,
});

describe('buildHolidayMarks', () => {
  it('marca un festivo con isHoliday, color y etiqueta', () => {
    const marks = buildHolidayMarks([holiday('2027-01-01', 'Año Nuevo')], '#dc2626');
    expect(marks['1-1']).toEqual({ color: '#dc2626', label: 'Año Nuevo', isHoliday: true });
  });

  it('fusiona dos festivos en la misma fecha sin perder etiquetas', () => {
    const marks = buildHolidayMarks(
      [holiday('2027-05-01', 'Día del Trabajo'), holiday('2027-05-01', 'Fiesta regional')],
      '#dc2626',
    );
    expect(Object.keys(marks)).toEqual(['5-1']);
    expect(marks['5-1'].label).toBe('Día del Trabajo · Fiesta regional');
    expect(marks['5-1'].isHoliday).toBe(true);
    expect(marks['5-1'].color).toBe('#dc2626');
  });

  it('no duplica una etiqueta repetida en la misma fecha', () => {
    const marks = buildHolidayMarks(
      [holiday('2027-05-01', 'Fiesta regional'), holiday('2027-05-01', 'Fiesta regional')],
      '#dc2626',
    );
    expect(marks['5-1'].label).toBe('Fiesta regional');
  });

  it('separa festivos de fechas distintas', () => {
    const marks = buildHolidayMarks(
      [holiday('2027-01-01', 'Año Nuevo'), holiday('2027-12-25', 'Navidad')],
      '#dc2626',
    );
    expect(Object.keys(marks).sort()).toEqual(['1-1', '12-25']);
  });
});
