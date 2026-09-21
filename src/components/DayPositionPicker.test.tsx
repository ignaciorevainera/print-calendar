import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DayPositionPicker } from './DayPositionPicker';

describe('DayPositionPicker', () => {
  it('usa disabledMessage al pulsar una posición deshabilitada', () => {
    const onShowToast = vi.fn();
    render(
      <DayPositionPicker
        value="center"
        onChange={() => {}}
        onShowToast={onShowToast}
        disabledPositions={['center']}
        disabledMessage="Mensaje personalizado"
      />,
    );

    fireEvent.click(screen.getByTitle('Mensaje personalizado'));

    expect(onShowToast).toHaveBeenCalledWith('Mensaje personalizado', 'error');
  });

  it('emite el mensaje de deflexión con la etiqueta de la posición', () => {
    const onShowToast = vi.fn();
    render(
      <DayPositionPicker
        value="center"
        onChange={(_pos, _onBlocked, onDeflected) => onDeflected?.('top-right')}
        onShowToast={onShowToast}
      />,
    );

    fireEvent.click(screen.getByTitle('↗ Superior Derecha'));

    expect(onShowToast).toHaveBeenCalledWith(
      'Posición de nota ajustada a Sup. Derecha para evitar colisión',
      'info',
    );
  });
});
