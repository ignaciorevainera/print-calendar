import React from "react";
import { MonthInfo, FontFamilyKey, HeaderTitleSize } from "../types";
import { CalendarMonth } from "./CalendarMonth";
import { useCalendarStore } from "../store/useCalendarStore";
import { chunkMonths } from "../utils/calendarHelper";
import { customCalendarOverrides } from "../utils/calendarTheme";

const headerTitleSizeMap: Record<HeaderTitleSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

const headerSubtitleSizeMap: Record<HeaderTitleSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
  "2xl": "text-xl",
  "3xl": "text-2xl",
};

interface CalendarCanvasProps {
  months: MonthInfo[];
  onSelectDay: (dayKey: string, dayNumber: number, monthName: string) => void;
}

export const CalendarCanvas: React.FC<CalendarCanvasProps> = ({
  months,
  onSelectDay,
}) => {
  const {
    year,
    palette,
    fontFamily,
    weekStart,
    highlightWeekends,
    subtitle,
    markedDays,
    layout,
    headerTitleSize,
    showPageNumber,
    calendarBgColor,
  } = useCalendarStore();

  const computedBg = calendarBgColor || "var(--cal-bg)";

  const fontClassMap: Record<FontFamilyKey, string> = {
    jakarta: 'font-["Plus_Jakarta_Sans",sans-serif]',
    inter: 'font-["Inter",sans-serif]',
    playfair: 'font-["Playfair_Display",serif]',
    roboto: 'font-["Roboto",sans-serif]',
    lora: 'font-["Lora",serif]',
    fira: 'font-["Fira_Code",monospace]',
    jetbrains: 'font-["JetBrains_Mono",monospace]',
  };

  const gridClassMap: Record<typeof layout, string> = {
    anual: "grid-rows-3 gap-3",
    semestral: "grid-rows-2 gap-4",
    trimestral: "grid-rows-1 gap-6",
    mensual: "grid-rows-1 gap-6",
  };

  const gridBaseColsMap: Record<typeof layout, number> = {
    anual: 4,
    semestral: 3,
    trimestral: 3,
    mensual: 1,
  };

  const pages = chunkMonths(months, layout);
  const minWidthClass = layout === "mensual" ? "min-w-[480px]" : "min-w-[960px]";

  return (
    <div className="w-full flex flex-col items-start lg:items-center gap-8 mb-8 print:p-0 print:m-0 print:gap-0 overflow-x-auto pb-4 px-2">
      {pages.map((pageMonths, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className={`page-a4 theme-${palette} ${fontClassMap[fontFamily]} ${minWidthClass} print:min-w-0 relative w-full max-w-[1120px] aspect-[297/210] text-[var(--cal-text)] p-6 rounded-sm shadow-md print:shadow-none print:rounded-none print:max-w-none print:w-full print:h-full print:aspect-auto flex flex-col justify-between box-border border border-[var(--cal-border)] print:border-none`}
          style={{
            backgroundColor: computedBg,
            boxSizing: "border-box",
            ...customCalendarOverrides(calendarBgColor, palette),
          } as React.CSSProperties}
        >
          <div className="w-full mb-2 pb-1 border-b border-[var(--cal-border)] shrink-0 box-border flex justify-between items-center px-2">
            <div className="flex items-baseline gap-2">
              <h1
                className={`font-bold tracking-tight text-[var(--cal-text)] leading-tight ${headerTitleSizeMap[headerTitleSize]}`}
              >
                {year}
              </h1>
              {subtitle && subtitle.trim().length > 0 && (
                <span
                  className={`font-semibold tracking-widest uppercase text-[var(--cal-accent)] leading-tight ${headerSubtitleSizeMap[headerTitleSize]}`}
                >
                  · {subtitle}
                </span>
              )}
            </div>
            {pages.length > 1 && showPageNumber && (
              <span className="text-[10px] text-[var(--cal-muted)] font-mono">
                Pag. {pageIndex + 1}/{pages.length}
              </span>
            )}
          </div>

          <div
            data-testid={`calendar-grid-${pageIndex}`}
            className={`grid ${gridClassMap[layout]} flex-1 h-full w-full min-h-0 box-border`}
            style={{
              gridTemplateColumns: `repeat(${Math.min(pageMonths.length, gridBaseColsMap[layout])}, minmax(0, 1fr))`,
            }}
          >
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
