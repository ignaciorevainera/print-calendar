import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { 
  PaletteKey, 
  FontFamilyKey, 
  WeekStart, 
  MarkedDaysMap, 
  LayoutType, 
  DayNumberSize, 
  DayTextSize,
  DayNumberPosition, 
  MonthRange,
  HeaderTitleSize,
  MonthTitleSize,
  CalendarLocale
} from '../types';

export const hasHolidayOrLabelMarked = (markedDays: MarkedDaysMap): boolean => {
  return Object.values(markedDays).some((d) => d.isHoliday || (d.label && d.label.trim() !== ''));
};

const isMiddleRow = (pos: DayNumberPosition): boolean => pos.startsWith('middle') || pos === 'center';

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

interface CalendarState {
  year: number;
  palette: PaletteKey;
  fontFamily: FontFamilyKey;
  weekStart: WeekStart;
  highlightWeekends: boolean;
  subtitle: string;
  markedDays: MarkedDaysMap;
  layout: LayoutType;
  dayNumberSize: DayNumberSize;
  dayTextSize: DayTextSize;
  headerTitleSize: HeaderTitleSize;
  monthTitleSize: MonthTitleSize;
  dayNumberPosition: DayNumberPosition;
  dayNotePosition: DayNumberPosition;
  dayNoteBold: boolean;
  monthRange: MonthRange;
  locale: CalendarLocale;
  showPageNumber: boolean;
  calendarBgColor: string;
  setYear: (year: number) => void;
  setPalette: (palette: PaletteKey) => void;
  setFontFamily: (fontFamily: FontFamilyKey) => void;
  setWeekStart: (weekStart: WeekStart) => void;
  setHighlightWeekends: (highlight: boolean) => void;
  setSubtitle: (subtitle: string) => void;
  setMarkedDays: (
    markedDays: MarkedDaysMap | ((prev: MarkedDaysMap) => MarkedDaysMap),
    onPositionAdjusted?: (numPos: DayNumberPosition, notePos: DayNumberPosition) => void
  ) => void;
  setLayout: (layout: LayoutType) => void;
  setDayNumberSize: (size: DayNumberSize) => void;
  setDayTextSize: (dayTextSize: DayTextSize) => void;
  setHeaderTitleSize: (size: HeaderTitleSize) => void;
  setMonthTitleSize: (size: MonthTitleSize) => void;
  setDayNumberPosition: (position: DayNumberPosition, onBlocked?: () => void, onDeflected?: (newNotePos: DayNumberPosition) => void) => void;
  setDayNotePosition: (position: DayNumberPosition, onBlocked?: () => void, onDeflected?: (newNumPos: DayNumberPosition) => void) => void;
  setDayNoteBold: (bold: boolean) => void;
  setMonthRange: (range: MonthRange) => void;
  setLocale: (locale: CalendarLocale) => void;
  setShowPageNumber: (show: boolean) => void;
  setCalendarBgColor: (color: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  temporal(
    persist(
      (set, get) => ({
        year: 2027,
        palette: 'gris',
        fontFamily: 'jakarta',
        weekStart: 'monday',
        highlightWeekends: true,
        subtitle: '',
        markedDays: {},
        layout: 'anual',
        dayNumberSize: 'md',
        dayTextSize: 'md',
        headerTitleSize: 'md',
        monthTitleSize: 'md',
        dayNumberPosition: 'center',
        dayNotePosition: 'bottom-left',
        dayNoteBold: false,
        monthRange: { start: 1, end: 12 },
        locale: 'es',
        showPageNumber: true,
        calendarBgColor: '',
        setYear: (year) => set({ year }),
        setPalette: (palette) => set({ palette }),
        setFontFamily: (fontFamily) => set({ fontFamily }),
        setWeekStart: (weekStart) => set({ weekStart }),
        setHighlightWeekends: (highlightWeekends) => set({ highlightWeekends }),
        setSubtitle: (subtitle) => set({ subtitle }),
        setMarkedDays: (markedDays, onPositionAdjusted) => set((state) => {
          const nextMarked = typeof markedDays === 'function' ? markedDays(state.markedDays) : markedDays;
          let newNumberPos = state.dayNumberPosition;
          let newNotePos = state.dayNotePosition;
          let adjusted = false;

          if (hasHolidayOrLabelMarked(nextMarked)) {
            if (isMiddleRow(newNumberPos)) {
              newNumberPos = 'top-right';
              adjusted = true;
            }
            if (isMiddleRow(newNotePos)) {
              newNotePos = 'bottom-left';
              adjusted = true;
            }
          }

          if (adjusted && onPositionAdjusted) {
            onPositionAdjusted(newNumberPos, newNotePos);
          }

          return {
            markedDays: nextMarked,
            dayNumberPosition: newNumberPos,
            dayNotePosition: newNotePos,
          };
        }),
        setLayout: (layout) => set({ layout }),
        setDayNumberSize: (dayNumberSize) => set({ dayNumberSize }),
        setDayTextSize: (dayTextSize) => set({ dayTextSize }),
        setHeaderTitleSize: (headerTitleSize) => set({ headerTitleSize }),
        setMonthTitleSize: (monthTitleSize) => set({ monthTitleSize }),
        setDayNumberPosition: (dayNumberPosition, onBlocked, onDeflected) => {
          if (hasHolidayOrLabelMarked(get().markedDays) && isMiddleRow(dayNumberPosition)) {
            onBlocked?.();
            return;
          }

          if (dayNumberPosition === get().dayNotePosition) {
            const newNotePos = OPPOSITE_POSITIONS[dayNumberPosition];
            set({ dayNumberPosition, dayNotePosition: newNotePos });
            onDeflected?.(newNotePos);
          } else {
            set({ dayNumberPosition });
          }
        },
        setDayNotePosition: (dayNotePosition, onBlocked) => {
          if (hasHolidayOrLabelMarked(get().markedDays) && isMiddleRow(dayNotePosition)) {
            onBlocked?.();
            return;
          }

          if (dayNotePosition === get().dayNumberPosition) {
            onBlocked?.();
            return;
          }

          set({ dayNotePosition });
        },
        setDayNoteBold: (dayNoteBold) => set({ dayNoteBold }),
        setMonthRange: (monthRange) => set({ monthRange }),
        setLocale: (locale) => set({ locale }),
        setShowPageNumber: (showPageNumber) => set({ showPageNumber }),
        setCalendarBgColor: (calendarBgColor) => set({ calendarBgColor }),
      }),
      {
        name: 'print-calendar-storage',
      }
    ),
    {
      limit: 30,
      partialize: (state) => {
        const {
          setYear, setPalette, setFontFamily, setWeekStart, setHighlightWeekends,
          setSubtitle, setMarkedDays, setLayout, setDayNumberSize, setDayTextSize,
          setHeaderTitleSize, setMonthTitleSize, setDayNumberPosition, setDayNotePosition,
          setDayNoteBold,
          setMonthRange, setLocale, setShowPageNumber, setCalendarBgColor,
          ...rest
        } = state;
        return rest;
      }
    }
  )
);

