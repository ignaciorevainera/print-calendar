import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';
import { useCalendarStore } from './store/useCalendarStore';

const baseState = {
  year: 2027,
  locale: 'es' as const,
  monthRange: { start: 1, end: 12 },
  layout: 'anual' as const,
  palette: 'gris' as const,
  markedDays: {},
  calendarBgColor: '',
  dayNumberPosition: 'center' as const,
  dayNotePosition: 'bottom-left' as const,
};

afterEach(() => {
  useCalendarStore.setState({ palette: 'gris', markedDays: {}, calendarBgColor: '' });
});

describe('App chrome', () => {
  it('usa tema claro con paleta gris', () => {
    useCalendarStore.setState({ ...baseState });
    const { container } = render(<App />);

    const root = container.firstElementChild;
    expect(root?.getAttribute('data-theme')).toBe('light');
  });

  it('usa tema oscuro con paleta nocturno', () => {
    useCalendarStore.setState({ ...baseState, palette: 'nocturno' });
    const { container } = render(<App />);

    const root = container.firstElementChild;
    expect(root?.getAttribute('data-theme')).toBe('dark');
    expect(root?.className).toContain('bg-slate-900');
  });

  it('muestra el toast abajo a la derecha', () => {
    useCalendarStore.setState({ ...baseState });
    const { container } = render(<App />);

    fireEvent.click(screen.getAllByTitle(/^Marcar 15 de /)[0]);
    fireEvent.click(screen.getByRole('button', { name: /^Guardar$/i }));

    const toast = container.querySelector('.toast');
    expect(toast).not.toBeNull();
    expect(toast?.className).toContain('toast-end');
    expect(toast?.className).not.toContain('toast-center');
  });
});
