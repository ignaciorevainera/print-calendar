import { describe, expect, it } from 'vitest';
import { MIDDLE_POSITIONS, OPPOSITE_POSITIONS, isMiddleRow } from './dayPosition';
import { DayNumberPosition } from '../types';

describe('dayPosition', () => {
  it('mapea cada posición a su opuesta', () => {
    expect(OPPOSITE_POSITIONS).toEqual({
      'top-left': 'bottom-right',
      'top-center': 'bottom-center',
      'top-right': 'bottom-left',
      'middle-left': 'middle-right',
      center: 'bottom-right',
      'middle-right': 'middle-left',
      'bottom-left': 'top-right',
      'bottom-center': 'top-center',
      'bottom-right': 'top-left',
    });
  });

  it('expone las tres posiciones de la fila central', () => {
    expect(MIDDLE_POSITIONS).toEqual(['middle-left', 'center', 'middle-right']);
  });

  it('detecta la fila central sin detectar las esquinas', () => {
    const central: DayNumberPosition[] = [...MIDDLE_POSITIONS];
    const outer: DayNumberPosition[] = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];

    expect(central.every((pos) => isMiddleRow(pos))).toBe(true);
    expect(outer.some((pos) => isMiddleRow(pos))).toBe(false);
  });
});
