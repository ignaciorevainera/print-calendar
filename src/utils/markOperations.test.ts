import { describe, expect, it } from 'vitest';
import { removeDayMark, removeSeriesMarks } from './markOperations';
import { MarkedDaysMap } from '../types';

describe('removeDayMark', () => {
  it('elimina la marca completa aunque sea festivo', () => {
    const result = removeDayMark({ '1-1': { color: '#dc2626', isHoliday: true } }, '1-1');
    expect(result).toEqual({});
  });

  it('no muta el mapa original y conserva otras marcas', () => {
    const original: MarkedDaysMap = {
      '1-1': { color: '#dc2626', isHoliday: true },
      '1-2': { color: '#2563eb', label: 'Evento' },
    };
    const result = removeDayMark(original, '1-1');
    expect(Object.keys(original).sort()).toEqual(['1-1', '1-2']);
    expect(Object.keys(result)).toEqual(['1-2']);
  });
});

describe('removeSeriesMarks', () => {
  it('elimina todos los días de la serie y reporta el conteo', () => {
    const original: MarkedDaysMap = {
      '1-1': { color: '#2563eb', seriesId: 's1' },
      '2-1': { color: '#2563eb', seriesId: 's1' },
      '3-1': { color: '#059669', label: 'Suelto' },
    };
    const result = removeSeriesMarks(original, 's1');
    expect(result.removedCount).toBe(2);
    expect(Object.keys(result.markedDays)).toEqual(['3-1']);
    expect(Object.keys(original)).toHaveLength(3);
  });

  it('elimina también días festivos de la serie sin dejar marcas fantasma', () => {
    const result = removeSeriesMarks({ '1-1': { color: '', isHoliday: true, seriesId: 's1' } }, 's1');
    expect(result.removedCount).toBe(1);
    expect(result.markedDays).toEqual({});
  });

  it('conserva el mapa y reporta cero cuando la serie no existe', () => {
    const original: MarkedDaysMap = { '1-1': { color: '#2563eb', seriesId: 's1' } };

    const result = removeSeriesMarks(original, 'otra-serie');

    expect(result.removedCount).toBe(0);
    expect(result.markedDays).toEqual(original);
    expect(result.markedDays).not.toBe(original);
    expect(Object.keys(original)).toEqual(['1-1']);
  });
});
