import React from 'react';
import { MonthInfo, PaletteKey, WeekStart, FontFamilyKey, MarkedDaysMap } from '../types';
import { CalendarMonth } from './CalendarMonth';
import { useCalendarStore } from '../store/useCalendarStore';
import { chunkMonths } from '../utils/calendarHelper';

interface CalendarCanvasProps {
  months: MonthInfo[];
  palette: PaletteKey;
  fontFamily: FontFamilyKey;
  weekStart: WeekStart;
  highlightWeekends: boolean;
  subtitle: string;
  markedDays: MarkedDaysMap;
  onSelectDay: (dayKey: string, dayNumber: number, monthName: string) => void;
}

export const CalendarCanvas: React.FC<CalendarCanvasProps> = ({
  months,
  palette,
  fontFamily,
  weekStart,
  highlightWeekends,
  subtitle,
  markedDays,
  onSelectDay
}) => {
  const layout = useCalendarStore((s) => s.layout);
  const fontClassMap: Record<FontFamilyKey, string> = {
    jakarta: 'font-["Plus_Jakarta_Sans",sans-serif]',
    inter: 'font-["Inter",sans-serif]',
    playfair: 'font-["Playfair_Display",serif]'
  };

  const gridClassMap: Record<typeof layout, string> = {
    anual: 'grid-cols-4 grid-rows-3 gap-2 md:gap-3',
    semestral: 'grid-cols-3 grid-rows-2 gap-3 md:gap-4',
    trimestral: 'grid-cols-3 grid-rows-1 gap-4 md:gap-6',
    mensual: 'grid-cols-1 grid-rows-1 gap-6'
  };

  const pages = chunkMonths(months, layout);

  return (
    <div className="w-full flex flex-col items-center gap-8 py-4 md:py-8 px-2 md:px-4 print:p-0 print:m-0 print:gap-0">
      {pages.map((pageMonths, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className={`page-a4 theme-${palette} ${fontClassMap[fontFamily]} relative w-full max-w-[1120px] aspect-[297/210] bg-white text-[var(--cal-text)] p-4 md:p-6 rounded-sm shadow-md print:shadow-none print:rounded-none print:max-w-none print:w-full print:h-full print:aspect-auto flex flex-col justify-between box-border border border-[var(--cal-border)] print:border-none`}
          style={{ boxSizing: 'border-box' }}
        >
          {((subtitle && subtitle.trim().length > 0) || pages.length > 1) && (
            <div className="w-full text-center mb-2 pb-1 border-b border-[var(--cal-border)] shrink-0 box-border flex justify-between items-center px-2">
              <span className="text-[10px] opacity-0 select-none">
                {pages.length > 1 ? `Pag. ${pageIndex + 1}` : ''}
              </span>
              <h2 className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--cal-accent)] leading-tight">
                {subtitle || ''}
              </h2>
              <span className="text-[10px] text-[var(--cal-muted)] font-mono">
                {pages.length > 1 ? `Pag. ${pageIndex + 1}/${pages.length}` : ''}
              </span>
            </div>
          )}

          <div className={`grid ${gridClassMap[layout]} flex-1 h-full w-full min-h-0 box-border`}>
            {pageMonths.map((month) => (
              <CalendarMonth
                key={`month-${month.monthIndex}`}
                month={month}
                weekStart={weekStart}
                highlightWeekends={highlightWeekends}
                markedDays={markedDays}
                onSelectDay={onSelectDay}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
