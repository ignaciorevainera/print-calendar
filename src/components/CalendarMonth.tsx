import React from 'react';
import { MonthInfo, WeekStart, MarkedDaysMap } from '../types';
import { DAYS_MONDAY_START, DAYS_SUNDAY_START, isWeekendIndex } from '../utils/calendarHelper';

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
  const dayHeaders = weekStart === 'monday' ? DAYS_MONDAY_START : DAYS_SUNDAY_START;

  return (
    <div 
      id={`month-card-${month.monthIndex}`}
      className="month-card flex flex-col p-1.5 md:p-2 rounded-sm border border-[var(--cal-grid-border)] bg-[var(--cal-bg)] transition-colors h-full w-full overflow-hidden box-border"
    >
      {/* Month Name Header */}
      <div className="text-center pb-1 mb-1 border-b border-[var(--cal-border)] shrink-0">
        <h3 className="text-[11px] md:text-[12px] font-bold tracking-wider text-[var(--cal-text)] uppercase select-none leading-tight">
          {month.name}
        </h3>
      </div>

      {/* Strict fixed table layout to ensure deterministically aligned columns and rows during PDF generation */}
      <div className="flex-1 w-full min-h-0 flex flex-col">
        <table className="cal-table w-full h-full border-collapse table-fixed text-center select-none">
          <thead>
            <tr className="cal-header-row">
              {dayHeaders.map((day, idx) => {
                const isWeekend = isWeekendIndex(idx, weekStart);
                return (
                  <th
                    key={`${month.name}-header-${idx}`}
                    className={`cal-day-header text-[9px] md:text-[10px] font-semibold text-center align-middle p-0 pb-0.5 select-none ${
                      isWeekend && highlightWeekends
                        ? 'text-[var(--cal-accent)]'
                        : 'text-[var(--cal-muted)]'
                    }`}
                  >
                    {day}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {month.weeks.map((week, weekIdx) => (
              <tr key={`week-${month.monthIndex}-${weekIdx}`} className="cal-week-row">
                {week.map((day, dayIdx) => {
                  if (day === null) {
                    return (
                      <td
                        key={`empty-${month.monthIndex}-${weekIdx}-${dayIdx}`}
                        className="cal-day-cell p-0.5 align-middle"
                      >
                        <span className="block w-full h-full" />
                      </td>
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
                    <td
                      key={`day-cell-${month.monthIndex}-${day}`}
                      className="cal-day-cell p-0.5 align-middle"
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
                                color: '#ffffff',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
                              }
                            : undefined
                        }
                        className={`w-full h-full min-h-0 p-0 m-0 text-[10px] md:text-[11px] rounded-xs flex items-center justify-center transition-all cursor-pointer select-none leading-none box-border ${
                          isSelected
                            ? 'font-bold ring-1 ring-black/10'
                            : isWeekend && highlightWeekends
                            ? 'bg-[var(--cal-weekend-bg)] text-[var(--cal-weekend)] font-semibold hover:brightness-95'
                            : 'text-[var(--cal-text)] font-normal hover:bg-[var(--cal-grid-border)]'
                        }`}
                      >
                        {day}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
