import { describe, expect, it } from 'vitest';
import { getMonthNames } from './i18n';
import { monthIndexFromName } from './monthIndex';

describe('monthIndexFromName', () => {
  it('devuelve el índice canónico del mes', () => {
    expect(monthIndexFromName('ENERO', getMonthNames('es'))).toBe(0);
  });

  it('devuelve null para un mes desconocido', () => {
    expect(monthIndexFromName('MES INEXISTENTE', getMonthNames('es'))).toBeNull();
  });

  it('devuelve null cuando no hay lista de meses', () => {
    expect(monthIndexFromName('ENERO', [])).toBeNull();
  });
});
