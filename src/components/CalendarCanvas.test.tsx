import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CalendarCanvas } from './CalendarCanvas';
import { useCalendarStore } from '../store/useCalendarStore';
import { generateYearData } from '../utils/calendarHelper';

describe('CalendarCanvas', () => {
  it('ajusta las columnas a los meses visibles en páginas parciales', () => {
    useCalendarStore.setState({ layout: 'anual' });
    const threeMonths = generateYearData(2027, 'monday', 'es').slice(0, 3);
    render(<CalendarCanvas months={threeMonths} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.style.gridTemplateColumns).toContain('repeat(3,');
  });

  it('mantiene 4 columnas con el año completo en layout anual', () => {
    useCalendarStore.setState({ layout: 'anual' });
    const year = generateYearData(2027, 'monday', 'es');
    render(<CalendarCanvas months={year} onSelectDay={() => {}} />);

    const grid = screen.getByTestId('calendar-grid-0');
    expect(grid.style.gridTemplateColumns).toContain('repeat(4,');
  });

  it('propaga el fondo personalizado a la página mediante variables CSS', () => {
    useCalendarStore.setState({ layout: 'anual', calendarBgColor: '#fefce8' });
    const year = generateYearData(2027, 'monday', 'es');
    const { container } = render(<CalendarCanvas months={year} onSelectDay={() => {}} />);

    const page = container.querySelector('.page-a4') as HTMLElement;
    expect(page.style.getPropertyValue('--cal-bg')).toBe('#fefce8');

    useCalendarStore.setState({ calendarBgColor: '' });
  });
});
