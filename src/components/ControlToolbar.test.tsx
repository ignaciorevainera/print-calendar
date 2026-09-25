import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ControlToolbar } from './ControlToolbar';
import { useCalendarStore } from '../store/useCalendarStore';

describe('ControlToolbar clear-all confirm', () => {
  it('deshabilita el borrado sin días marcados', () => {
    useCalendarStore.setState({ markedDays: {} });
    render(
      <ControlToolbar
        onPrint={vi.fn()}
        onClearSelectedDays={vi.fn()}
        onOpenHolidaysModal={vi.fn()}
      />,
    );

    const clearButton = document.getElementById('btn-clear-all-days') as HTMLButtonElement;
    expect(clearButton.disabled).toBe(true);
  });

  it('pide confirmación antes de borrar', () => {
    useCalendarStore.setState({ markedDays: { '1-15': { color: '#dc2626', label: 'Fiesta' } } });
    const onClearSelectedDays = vi.fn();
    render(
      <ControlToolbar
        onPrint={vi.fn()}
        onClearSelectedDays={onClearSelectedDays}
        onOpenHolidaysModal={vi.fn()}
      />,
    );

    const clearButton = document.getElementById('btn-clear-all-days') as HTMLButtonElement;
    fireEvent.click(clearButton);
    expect(onClearSelectedDays).not.toHaveBeenCalled();
    expect(screen.getByText('¿Confirmar borrado?')).toBeTruthy();

    fireEvent.click(clearButton);
    expect(onClearSelectedDays).toHaveBeenCalledTimes(1);
  });

  it('restaura el año actual si el input queda incompleto al desenfocar', () => {
    useCalendarStore.setState({ year: 2027 });
    render(
      <ControlToolbar
        onPrint={vi.fn()}
        onClearSelectedDays={vi.fn()}
        onOpenHolidaysModal={vi.fn()}
      />,
    );

    const yearInput = document.getElementById('input-year') as HTMLInputElement;
    fireEvent.change(yearInput, { target: { value: '202' } });
    fireEvent.blur(yearInput);

    expect(useCalendarStore.getState().year).toBe(2027);
    expect(yearInput.value).toBe('2027');
  });
});
