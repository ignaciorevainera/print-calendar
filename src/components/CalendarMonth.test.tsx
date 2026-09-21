import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CalendarMonth } from './CalendarMonth';
import { useCalendarStore } from '../store/useCalendarStore';
import { generateYearData } from '../utils/calendarHelper';

const january = generateYearData(2027, 'monday', 'es')[0];

describe('CalendarMonth', () => {
  it('muestra la etiqueta en layout no mensual', () => {
    useCalendarStore.setState({ layout: 'anual' });
    render(
      <CalendarMonth
        month={january}
        weekStart="monday"
        highlightWeekends
        markedDays={{ '1-15': { color: '#dc2626', label: 'Fiesta', isHoliday: true } }}
      />,
    );

    expect(screen.getByText('Fiesta')).toBeTruthy();
    expect(screen.getByText('15')).toBeTruthy();
  });

  it('muestra solo el número si no hay etiqueta en layout no mensual', () => {
    useCalendarStore.setState({ layout: 'anual' });
    render(
      <CalendarMonth
        month={january}
        weekStart="monday"
        highlightWeekends
        markedDays={{ '1-16': { color: '#2563eb' } }}
      />,
    );

    expect(screen.getByText('16')).toBeTruthy();
    const dayButton = document.getElementById('btn-day-1-16');
    expect(dayButton?.querySelectorAll('span')).toHaveLength(1);
  });
});
