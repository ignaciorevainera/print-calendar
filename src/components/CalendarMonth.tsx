import React from 'react';
import { MonthInfo, WeekStart, MarkedDaysMap, DayNumberPosition, DayNumberSize, DayTextSize, MonthTitleSize } from '../types';
import { isWeekendIndex } from '../utils/calendarHelper';
import { getDayLetters } from '../utils/i18n';
import { useCalendarStore } from '../store/useCalendarStore';

const monthTitleSizeMap: Record<MonthTitleSize, string> = {
  sm: 'text-[9px] md:text-[10px]',
  md: 'text-[11px] md:text-[12px]',
  lg: 'text-[13px] md:text-[14px]',
  xl: 'text-[15px] md:text-[16px]'
};

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

const labelSizeMap: Record<DayTextSize, string> = {
  sm: 'text-[8px] md:text-[9px] px-1 py-0.5',
  md: 'text-[9px] md:text-[10px] px-1 py-0.5',
  lg: 'text-[10px] md:text-[11px] px-1.5 py-0.5',
};

const noteSizeMap: Record<DayTextSize, string> = {
  sm: 'text-[7.5px] md:text-[8.5px] leading-tight line-clamp-5',
  md: 'text-[9px] md:text-[10px] leading-tight line-clamp-4',
  lg: 'text-[10px] md:text-[11px] leading-snug line-clamp-3',
};

const noteTextAlignMap: Record<DayNumberPosition, string> = {
  'top-left': 'text-left',
  'top-center': 'text-center',
  'top-right': 'text-right',
  'middle-left': 'text-left',
  'center': 'text-center',
  'middle-right': 'text-right',
  'bottom-left': 'text-left',
  'bottom-center': 'text-center',
  'bottom-right': 'text-right',
};

const OPPOSITE_POSITIONS: Record<DayNumberPosition, DayNumberPosition> = {
  'top-left': 'bottom-right',
  'top-center': 'bottom-center',
  'top-right': 'bottom-left',
  'middle-left': 'middle-right',
  'center': 'bottom-right',
  'middle-right': 'middle-left',
  'bottom-left': 'top-right',
  'bottom-center': 'top-center',
  'bottom-right': 'top-left',
};

const isMiddleRow = (pos: DayNumberPosition): boolean => pos.startsWith('middle') || pos === 'center';

export function resolveNotePosition(
  numberPos: DayNumberPosition,
  notePos: DayNumberPosition,
  isHoliday: boolean
): DayNumberPosition {
  let resolved = notePos;
  if (isHoliday && isMiddleRow(resolved)) {
    resolved = 'bottom-left';
  }
  if (numberPos === resolved) {
    return OPPOSITE_POSITIONS[numberPos] || 'bottom-right';
  }
  return resolved;
}

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
  const dayTextSize = useCalendarStore((state) => state.dayTextSize);
  const monthTitleSize = useCalendarStore((state) => state.monthTitleSize);
  const dayNumberPosition = useCalendarStore((state) => state.dayNumberPosition);
  const dayNotePosition = useCalendarStore((state) => state.dayNotePosition);
  const layout = useCalendarStore((state) => state.layout);
  const locale = useCalendarStore((state) => state.locale);
  const isMonthly = layout === 'mensual';
  const dayHeaders = getDayLetters(locale, weekStart);

  return (
    <div 
      id={`month-card-${month.monthIndex}`}
      className="month-card flex flex-col p-1.5 md:p-2 rounded-sm border border-[var(--cal-grid-border)] bg-[var(--cal-bg)] transition-colors h-full w-full overflow-hidden box-border"
    >
      <div className="h-6 flex items-center justify-center border-b border-[var(--cal-border)] mb-1 pb-0.5 shrink-0">
        <h3 className={`font-bold tracking-wider text-[var(--cal-text)] uppercase select-none leading-none ${monthTitleSizeMap[monthTitleSize]}`}>
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

      <div 
        className="flex-1 w-full min-h-0 grid gap-0"
        style={{
          gridTemplateRows: `repeat(${month.weeks.length}, minmax(0, 1fr))`
        }}
      >
        {month.weeks.map((week, weekIdx) => (
          <div 
            key={`week-${month.monthIndex}-${weekIdx}`} 
            className="grid grid-cols-7 w-full h-full min-h-0 items-stretch gap-0"
          >
            {week.map((day, dayIdx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${month.monthIndex}-${weekIdx}-${dayIdx}`}
                    className="w-full h-full min-h-0 p-0.5 box-border"
                  />
                );
              }

              const isWeekend = isWeekendIndex(dayIdx, weekStart);
              const dayKey = `${month.monthIndex + 1}-${day}`;
              const markInfo = markedDays ? markedDays[dayKey] : undefined;
              const isSelected = Boolean(markInfo);
              const cellNotePos = resolveNotePosition(dayNumberPosition, dayNotePosition, Boolean(markInfo?.isHoliday || markInfo?.label));

              const dayTitle = isSelected
                ? markInfo?.label
                  ? `${day} de ${month.name}: ${markInfo.label} - Clic para editar o desmarcar`
                  : `Día marcado: ${day} de ${month.name} - Clic para cambiar color o desmarcar`
                : `Marcar ${day} de ${month.name} (elegir color)`;

              return (
                <div
                  key={`day-cell-${month.monthIndex}-${day}`}
                  className="w-full h-full min-h-0 p-0.5 box-border"
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
                    className={`w-full h-full min-h-0 m-0 rounded-xs flex cursor-pointer select-none leading-none box-border touch-manipulation ${
                      isMonthly
                        ? 'p-0 overflow-hidden'
                        : `${positionClassMap[dayNumberPosition]} ${sizeClassMap[dayNumberSize]}`
                    } ${
                      isSelected
                        ? 'font-bold'
                        : isWeekend && highlightWeekends
                        ? 'bg-[var(--cal-weekend-bg)] text-[var(--cal-weekend)] font-semibold hover:brightness-95'
                        : 'text-[var(--cal-text)] font-normal hover:bg-[var(--cal-grid-border)]'
                    }`}
                  >
                    {isMonthly ? (
                      <div className="grid grid-cols-1 grid-rows-1 relative w-full h-full min-h-0 overflow-hidden box-border p-1">
                        <div
                          className={`col-start-1 row-start-1 w-full h-full min-h-0 min-w-0 overflow-hidden flex ${positionClassMap[dayNumberPosition]}`}
                        >
                          <div className={`flex w-full shrink-0 ${sizeClassMap[dayNumberSize]} ${positionClassMap[dayNumberPosition]}`}>
                            <span>{day}</span>
                          </div>
                        </div>
                        {isSelected && markInfo?.label && (
                          <div className="col-start-1 row-start-1 w-full h-full min-h-0 min-w-0 flex items-center justify-center p-0.5 pointer-events-none">
                            <span className={`inline-block w-full text-center font-bold rounded bg-black/20 text-white truncate max-w-full ${labelSizeMap[dayTextSize]}`}>
                              {markInfo.label}
                            </span>
                          </div>
                        )}
                        {isSelected && markInfo?.note && (
                          <div
                            className={`col-start-1 row-start-1 w-full h-full min-h-0 min-w-0 overflow-hidden flex ${positionClassMap[cellNotePos]}`}
                          >
                            <span
                              className={`${noteSizeMap[dayTextSize]} ${noteTextAlignMap[cellNotePos]} font-normal text-white/95 whitespace-pre-line overflow-hidden w-full break-words`}
                            >
                              {markInfo.note}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>{day}</span>
                    )}
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
