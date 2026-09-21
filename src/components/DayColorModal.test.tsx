import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DayColorModal } from './DayColorModal';

const renderModal = (onConfirm = vi.fn(), onClose = vi.fn()) => {
  render(
    <DayColorModal
      isOpen
      dayNumber={1}
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

  it('Escape cierra el modal', () => {
    const { onClose } = renderModal();

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
