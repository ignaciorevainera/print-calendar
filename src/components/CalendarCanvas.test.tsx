import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CalendarCanvas } from './CalendarCanvas';
import { useCalendarStore } from '../store/useCalendarStore';
import { generateYearData } from '../utils/calendarHelper';

const setCanvasState = (overrides: Partial<ReturnType<typeof useCalendarStore.getState>> = {}) => {
  useCalendarStore.setState({
    year: 2027,
    layout: 'anual',
    monthRange: { start: 1, end: 12 },
    calendarBgColor: '',
    ...overrides,
  });
};

afterEach(() => {
  useCalendarStore.setState({ layout: 'anual', calendarBgColor: '' });
});

describe('CalendarCanvas', () => {
  it('ajusta las columnas a los meses visibles en páginas parciales', () => {
    setCanvasState({ layout: 'anual' });
    const threeMonths = generateYearData(2027, 'monday', 'es').slice(0, 3);
    render(<CalendarCanvas months={threeMonths} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.style.gridTemplateColumns).toContain('repeat(3,');
  });

  it('mantiene 4 columnas con el año completo en layout anual', () => {
    setCanvasState({ layout: 'anual' });
    const year = generateYearData(2027, 'monday', 'es');
    render(<CalendarCanvas months={year} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.style.gridTemplateColumns).toContain('repeat(4,');
  });

  it('propaga el fondo personalizado a la página mediante variables CSS', () => {
    setCanvasState({ layout: 'anual', calendarBgColor: '#fefce8' });
    const year = generateYearData(2027, 'monday', 'es');
    const { container } = render(<CalendarCanvas months={year} onSelectDay={() => {}} />);

    const page = container.querySelector<HTMLElement>('.page-a4');
    expect(page).not.toBeNull();
    expect(page?.style.getPropertyValue('--cal-bg')).toBe('#fefce8');
  });

  it('usa 3 columnas en una página semestral parcial', () => {
    setCanvasState({ layout: 'semestral' });
    const months = generateYearData(2027, 'monday', 'es').slice(0, 5);
    render(<CalendarCanvas months={months} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.style.gridTemplateColumns).toContain('repeat(3,');
  });

  it('usa 3 columnas en una página trimestral parcial', () => {
    setCanvasState({ layout: 'trimestral' });
    const months = generateYearData(2027, 'monday', 'es').slice(0, 2);
    render(<CalendarCanvas months={months} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.style.gridTemplateColumns).toContain('repeat(2,');
  });

  it('usa una sola columna en layout mensual', () => {
    setCanvasState({ layout: 'mensual' });
    const months = generateYearData(2027, 'monday', 'es').slice(0, 1);
    render(<CalendarCanvas months={months} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.style.gridTemplateColumns).toContain('repeat(1,');
  });

  it('preserva filas y huecos del layout anual', () => {
    setCanvasState({ layout: 'anual' });
    const year = generateYearData(2027, 'monday', 'es');
    render(<CalendarCanvas months={year} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.className).toContain('grid-rows-3');
    expect(grid.className).toContain('gap-3');
  });
});
