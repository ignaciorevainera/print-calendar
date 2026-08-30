import React from "react";
import { MonthInfo, FontFamilyKey, HeaderTitleSize } from "../types";
import { CalendarMonth } from "./CalendarMonth";
import { useCalendarStore } from "../store/useCalendarStore";
import { chunkMonths } from "../utils/calendarHelper";
import { getContrastTextColor } from "../utils/colorHelper";

const headerTitleSizeMap: Record<HeaderTitleSize, string> = {
  sm: "text-xs md:text-sm",
  md: "text-sm md:text-base",
  lg: "text-base md:text-lg",
  xl: "text-lg md:text-xl",
  "2xl": "text-xl md:text-2xl",
  "3xl": "text-2xl md:text-3xl",
};

const headerSubtitleSizeMap: Record<HeaderTitleSize, string> = {
  sm: "text-[10px] md:text-xs",
  md: "text-xs md:text-sm",
  lg: "text-sm md:text-base",
  xl: "text-base md:text-lg",
  "2xl": "text-lg md:text-xl",
  "3xl": "text-xl md:text-2xl",
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
  const isCustomBg = Boolean(calendarBgColor);
  const customContrast = isCustomBg ? getContrastTextColor(calendarBgColor) : undefined;

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
    anual: "grid-cols-4 grid-rows-3 gap-2 md:gap-3",
    semestral: "grid-cols-3 grid-rows-2 gap-3 md:gap-4",
    trimestral: "grid-cols-3 grid-rows-1 gap-4 md:gap-6",
    mensual: "grid-cols-1 grid-rows-1 gap-6",
  };

  const pages = chunkMonths(months, layout);
  const minWidthClass = layout === "mensual" ? "min-w-[300px]" : "min-w-[640px]";

  return (
    <div className="w-full flex flex-col items-start md:items-center gap-8 mb-8 print:p-0 print:m-0 print:gap-0 overflow-x-auto pb-4 px-2 sm:px-0">
      {pages.map((pageMonths, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className={`page-a4 theme-${palette} ${fontClassMap[fontFamily]} ${minWidthClass} md:min-w-0 print:min-w-0 relative w-full max-w-[1120px] aspect-[297/210] text-[var(--cal-text)] p-4 md:p-6 rounded-sm shadow-md print:shadow-none print:rounded-none print:max-w-none print:w-full print:h-full print:aspect-auto flex flex-col justify-between box-border border border-[var(--cal-border)] print:border-none`}
          style={{
            backgroundColor: computedBg,
            boxSizing: "border-box",
            ...(isCustomBg
              ? {
                  "--cal-text": customContrast,
                  "--cal-muted": customContrast === "#ffffff" ? "#94a3b8" : "#475569",
                  "--cal-accent": customContrast === "#ffffff" ? "#38bdf8" : "#1e40af",
                  "--cal-border": customContrast === "#ffffff" ? "#334155" : "#cbd5e1",
                  "--cal-grid-border": customContrast === "#ffffff" ? "#1e293b" : "#cbd5e1",
                }
              : {}),
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
            className={`grid ${gridClassMap[layout]} flex-1 h-full w-full min-h-0 box-border`}
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
