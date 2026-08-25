import React from 'react';
import { MonthInfo, PaletteKey, WeekStart, FontFamilyKey, MarkedDaysMap } from '../types';
import { CalendarMonth } from './CalendarMonth';

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
  const fontClassMap: Record<FontFamilyKey, string> = {
    jakarta: 'font-["Plus_Jakarta_Sans",sans-serif]',
    inter: 'font-["Inter",sans-serif]',
    playfair: 'font-["Playfair_Display",serif]'
  };

  return (
    <div className="w-full flex justify-center py-4 md:py-8 px-2 md:px-4 overflow-x-auto print:p-0 print:m-0">
      {/* 
        A4 Landscape Container:
        297mm x 210mm proportional aspect ratio (297/210 = 1.4142857)
        max-w-[1120px] on screen preview for sharp rendering
      */}
      <div
        id="calendar-canvas"
        className={`theme-${palette} ${fontClassMap[fontFamily]} relative w-full max-w-[1120px] aspect-[297/210] bg-white text-[var(--cal-text)] p-3 md:p-4 rounded-sm shadow-md print:shadow-none print:rounded-none print:max-w-none print:w-full print:h-full print:aspect-auto flex flex-col justify-between box-border border border-[var(--cal-border)] print:border-none`}
        style={{
          boxSizing: 'border-box'
        }}
      >
        {/* Optional Minimalist Subtitle Header (only displayed if provided) */}
        {subtitle && subtitle.trim().length > 0 && (
          <div className="w-full text-center mb-1.5 pb-1 border-b border-[var(--cal-border)] shrink-0 box-border">
            <h2 className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--cal-accent)] leading-tight">
              {subtitle}
            </h2>
          </div>
        )}

        {/* 12 Months Grid: 4 Columns x 3 Rows with strict container boundaries */}
        <div className="grid grid-cols-4 grid-rows-3 gap-2 md:gap-3 flex-1 h-full w-full min-h-0 box-border">
          {months.map((month) => (
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
    </div>
  );
};
