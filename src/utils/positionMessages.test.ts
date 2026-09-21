import { describe, expect, it } from 'vitest';
import { POSITION_LABELS, deflectionMessage } from './positionMessages';

describe('deflectionMessage', () => {
  it('usa la etiqueta legible de la posición destino', () => {
    expect(deflectionMessage('nota', 'top-right')).toBe(
      'Posición de nota ajustada a Sup. Derecha para evitar colisión',
    );
  });

  it('no menciona la fila inferior', () => {
    const message = deflectionMessage('número', 'middle-left').toLowerCase();
    expect(message).not.toContain('fila inferior');
  });

  it('cubre las nueve posiciones', () => {
    Object.values(POSITION_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
    expect(Object.keys(POSITION_LABELS)).toHaveLength(9);
  });
});
