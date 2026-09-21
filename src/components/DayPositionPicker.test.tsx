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
});
