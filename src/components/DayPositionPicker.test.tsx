import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DayPositionPicker } from './DayPositionPicker';
import { useCalendarStore } from '../store/useCalendarStore';

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

  it('usa disabledMessage cuando el almacén bloquea la posición', () => {
    const onShowToast = vi.fn();
    render(
      <DayPositionPicker
        value="center"
        onChange={(_pos, onBlocked) => onBlocked?.()}
        onShowToast={onShowToast}
        disabledMessage="Mensaje personalizado"
      />,
    );

    fireEvent.click(screen.getByTitle('• Centro'));

    expect(onShowToast).toHaveBeenCalledWith('Mensaje personalizado', 'error');
  });

  it('emite el mensaje de deflexión mediante callback onDeflected', () => {
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

  it('usa el mensaje de cuadrante compartido cuando no hay disabledMessage', () => {
    const onShowToast = vi.fn();
    render(
      <DayPositionPicker
        value="center"
        onChange={() => {}}
        onShowToast={onShowToast}
        disabledPositions={['top-left']}
        oppositeElementPosition="top-left"
      />,
    );

    fireEvent.click(screen.getByTitle('Posición no disponible'));

    expect(onShowToast).toHaveBeenCalledWith(
      'No se puede colocar la nota y el número en el mismo cuadrante',
      'error',
    );
  });

  it('usa el mensaje de fila central cuando no hay disabledMessage', () => {
    const onShowToast = vi.fn();
    render(
      <DayPositionPicker
        value="bottom-left"
        onChange={(_pos, onBlocked) => onBlocked?.()}
        onShowToast={onShowToast}
      />,
    );

    fireEvent.click(screen.getByTitle('• Centro'));

    expect(onShowToast).toHaveBeenCalledWith(
      'No se puede usar la fila central porque hay días festivos cargados en el calendario',
      'error',
    );
  });

  it('anuncia el ajuste del número cuando el picker es de nota', () => {
    const onShowToast = vi.fn();
    render(
      <DayPositionPicker
        pickerType="note"
        value="center"
        onChange={(_pos, _onBlocked, onDeflected) => onDeflected?.('bottom-left')}
        onShowToast={onShowToast}
      />,
    );

    fireEvent.click(screen.getByTitle('↗ Superior Derecha'));

    expect(onShowToast).toHaveBeenCalledWith(
      'Posición de número ajustada a Inf. Izquierda para evitar colisión',
      'info',
    );
  });

  it('anuncia el ajuste del número al escribir en el almacén', () => {
    const onShowToast = vi.fn();
    useCalendarStore.setState({ dayNumberPosition: 'center', dayNotePosition: 'bottom-left' });
    render(<DayPositionPicker onShowToast={onShowToast} />);

    fireEvent.click(screen.getByTitle('↙ Inferior Izquierda'));

    expect(onShowToast).toHaveBeenCalledWith(
      'Posición de número ajustada a Sup. Derecha para evitar colisión',
      'info',
    );
  });

  it('ajusta el número desde el almacén al elegir una posición de nota que colisiona', () => {
    const onShowToast = vi.fn();
    useCalendarStore.setState({ dayNumberPosition: 'center', dayNotePosition: 'bottom-left' });
    render(<DayPositionPicker pickerType="note" onShowToast={onShowToast} />);

    fireEvent.click(screen.getByTitle('↙ Inferior Izquierda'));

    expect(useCalendarStore.getState().dayNumberPosition).toBe('bottom-left');
    expect(onShowToast).toHaveBeenCalledWith(
      'Posición de número ajustada a Sup. Derecha para evitar colisión',
      'info',
    );
  });
});
