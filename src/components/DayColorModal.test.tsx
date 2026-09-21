import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DayColorModal } from './DayColorModal';

const renderModal = (onConfirm = vi.fn(), onClose = vi.fn(), dayNumber = 1) => {
  render(
    <DayColorModal
      isOpen
      dayNumber={dayNumber}
      monthName="ENERO"
      year={2027}
      onConfirm={onConfirm}
      onClose={onClose}
    />,
  );
  return { onConfirm, onClose };
};

describe('DayColorModal', () => {
  it('Enter dentro del campo de etiqueta no guarda', () => {
    const { onConfirm } = renderModal();
    const label = screen.getByLabelText(/Etiqueta o motivo/i);

    fireEvent.change(label, { target: { value: 'Cumpleaños' } });
    fireEvent.keyDown(label, { key: 'Enter' });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('Enter fuera de un control de formulario guarda', () => {
    const { onConfirm } = renderModal();

    fireEvent.keyDown(document.body, { key: 'Enter' });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('Enter con foco en un botón no dispara el guardado del teclado', () => {
    const { onConfirm } = renderModal();
    const saveButton = screen.getByRole('button', { name: /Guardar/i });

    fireEvent.keyDown(saveButton, { key: 'Enter' });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('Escape cierra el modal', () => {
    const { onClose } = renderModal();

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('bloquea el guardado si la fecha fin es anterior al día inicial', () => {
    const { onConfirm } = renderModal(vi.fn(), vi.fn(), 15);

    fireEvent.change(screen.getByLabelText(/Repetir marcador/i), {
      target: { value: 'custom_range' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha fin/i), {
      target: { value: '2027-01-05' },
    });

    expect(screen.getByText(/fecha fin es anterior/i)).toBeTruthy();
    expect(
      (screen.getByRole('button', { name: /Guardar/i }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('permite guardar con fecha fin válida', () => {
    renderModal(vi.fn(), vi.fn(), 15);

    fireEvent.change(screen.getByLabelText(/Repetir marcador/i), {
      target: { value: 'custom_range' },
    });

    expect(screen.queryByText(/fecha fin es anterior/i)).toBeNull();
    expect(
      (screen.getByRole('button', { name: /Guardar/i }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });
});
