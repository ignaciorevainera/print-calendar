import React from 'react';
import { MonthInfo, WeekStart, MarkedDaysMap, DayNumberPosition, DayNumberSize } from '../types';
import { DAYS_MONDAY_START, DAYS_SUNDAY_START, isWeekendIndex } from '../utils/calendarHelper';
import { useCalendarStore } from '../store/useCalendarStore';

const positionClassMap: Record<DayNumberPosition, string> = {
  'top-left': 'items-start justify-start p-1',
  'top-center': 'items-start justify-center pt-1',
  'top-right': 'items-start justify-end p-1',
  'middle-left': 'items-center justify-start pl-1',
  'center': 'items-center justify-center',
  'middle-right': 'items-center justify-end pr-1',
  'bottom-left': 'items-end justify-start p-1',
  'bottom-center': 'items-end justify-center pb-1',
  'bottom-right': 'items-end justify-end p-1',
};

const sizeClassMap: Record<DayNumberSize, string> = {
  sm: 'text-[8px] md:text-[9px]',
  md: 'text-[10px] md:text-[11px]',
  lg: 'text-[12px] md:text-[14px]',
  xl: 'text-[15px] md:text-[17px]',
};

interface CalendarMonthProps {
  month: MonthInfo;
  weekStart: WeekStart;
  highlightWeekends: boolean;
  markedDays?: MarkedDaysMap;
  onSelectDay?: (dayKey: string, dayNumber: number, monthName: string) => void;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  month,
  weekStart,
  highlightWeekends,
  markedDays,
  onSelectDay
}) => {
  const dayNumberSize = useCalendarStore((state) => state.dayNumberSize);
  const dayNumberPosition = useCalendarStore((state) => state.dayNumberPosition);
  const dayHeaders = weekStart === 'monday' ? DAYS_MONDAY_START : DAYS_SUNDAY_START;

  return (
    <div 
      id={`month-card-${month.monthIndex}`}
      className="month-card flex flex-col p-1.5 md:p-2 rounded-sm border border-[var(--cal-grid-border)] bg-[var(--cal-bg)] transition-colors h-full w-full overflow-hidden box-border"
    >
      <div className="h-6 flex items-center justify-center border-b border-[var(--cal-border)] mb-1 pb-0.5 shrink-0">
        <h3 className="text-[11px] md:text-[12px] font-bold tracking-wider text-[var(--cal-text)] uppercase select-none leading-none">
          {month.name}
        </h3>
      </div>

      <div className="flex flex-row h-4 mb-0.5 shrink-0 w-full">
        {dayHeaders.map((day, idx) => {
          const isWeekend = isWeekendIndex(idx, weekStart);
          return (
            <div
              key={`${month.name}-header-${idx}`}
              className={`w-[14.2857%] text-[9px] md:text-[10px] font-semibold text-center leading-4 select-none ${
                isWeekend && highlightWeekends
                  ? 'text-[var(--cal-accent)]'
                  : 'text-[var(--cal-muted)]'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex-1 w-full min-h-0 flex flex-col justify-between">
        {month.weeks.map((week, weekIdx) => (
          <div key={`week-${month.monthIndex}-${weekIdx}`} className="flex flex-row flex-1 min-h-0 w-full items-stretch">
            {week.map((day, dayIdx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${month.monthIndex}-${weekIdx}-${dayIdx}`}
                    className="w-[14.2857%] h-full p-0.5 box-border"
                  />
                );
              }

              const isWeekend = isWeekendIndex(dayIdx, weekStart);
              const dayKey = `${month.monthIndex + 1}-${day}`;
              const markInfo = markedDays ? markedDays[dayKey] : undefined;
              const isSelected = Boolean(markInfo);

              const dayTitle = isSelected
                ? markInfo?.label
                  ? `${day} de ${month.name}: ${markInfo.label} - Clic para editar o desmarcar`
                  : `Día marcado: ${day} de ${month.name} - Clic para cambiar color o desmarcar`
                : `Marcar ${day} de ${month.name} (elegir color)`;

              return (
                <div
                  key={`day-cell-${month.monthIndex}-${day}`}
                  className="w-[14.2857%] h-full p-0.5 box-border"
                >
                  <button
                    type="button"
                    id={`btn-day-${month.monthIndex + 1}-${day}`}
                    onClick={() => onSelectDay && onSelectDay(dayKey, day, month.name)}
                    title={dayTitle}
                    style={
                      isSelected && markInfo?.color
                        ? {
                            backgroundColor: markInfo.color,
                            color: '#ffffff'
                          }
                        : undefined
                    }
                    className={`w-full h-full min-h-0 p-0 m-0 rounded-xs flex cursor-pointer select-none leading-none box-border ${positionClassMap[dayNumberPosition]} ${sizeClassMap[dayNumberSize]} ${
                      isSelected
                        ? 'font-bold'
                        : isWeekend && highlightWeekends
                        ? 'bg-[var(--cal-weekend-bg)] text-[var(--cal-weekend)] font-semibold hover:brightness-95'
                        : 'text-[var(--cal-text)] font-normal hover:bg-[var(--cal-grid-border)]'
                    }`}
                  >
                    <span>{day}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
