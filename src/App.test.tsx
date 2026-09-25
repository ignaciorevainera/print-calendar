import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { useCalendarStore } from './store/useCalendarStore';

describe('App chrome', () => {
  it('usa tema claro con paleta gris', () => {
    useCalendarStore.setState({ palette: 'gris', markedDays: {} });
    const { container } = render(<App />);
    expect((container.firstChild as HTMLElement).getAttribute('data-theme')).toBe('light');
  });

  it('usa tema oscuro con paleta nocturno', () => {
    useCalendarStore.setState({ palette: 'nocturno', markedDays: {} });
    const { container, unmount } = render(<App />);
    expect((container.firstChild as HTMLElement).getAttribute('data-theme')).toBe('dark');
    expect((container.firstChild as HTMLElement).className).toContain('bg-slate-900');
    unmount();
    useCalendarStore.setState({ palette: 'gris' });
  });

  it('muestra el toast abajo a la derecha', () => {
    useCalendarStore.setState({ palette: 'gris', markedDays: {} });
    const { container, unmount } = render(<App />);

    fireEvent.click(screen.getByTitle(/Marcar 15 de ENERO/i));
    fireEvent.click(document.getElementById('btn-confirm-mark-color') as HTMLButtonElement);

    const toast = container.querySelector('.toast') as HTMLElement;
    expect(toast.className).toContain('toast-end');
    expect(toast.className).not.toContain('toast-center');
    unmount();
  });
});
