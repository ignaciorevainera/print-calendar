import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  PaletteKey, 
  FontFamilyKey, 
  WeekStart, 
  MarkedDaysMap, 
  LayoutType, 
  DayNumberSize, 
  DayTextSize,
  DayNumberPosition, 
  MonthRange 
} from '../types';

const hasHolidayMarked = (markedDays: MarkedDaysMap): boolean => {
  return Object.values(markedDays).some((d) => d.isHoliday);
};

const isBottomRow = (pos: DayNumberPosition): boolean => pos.startsWith('bottom');
const isMiddleRow = (pos: DayNumberPosition): boolean => pos.startsWith('middle') || pos === 'center';

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
  dayNumberPosition: DayNumberPosition;
  dayNotePosition: DayNumberPosition;
  monthRange: MonthRange;
  setYear: (year: number) => void;
  setPalette: (palette: PaletteKey) => void;
  setFontFamily: (fontFamily: FontFamilyKey) => void;
  setWeekStart: (weekStart: WeekStart) => void;
  setHighlightWeekends: (highlight: boolean) => void;
  setSubtitle: (subtitle: string) => void;
  setMarkedDays: (markedDays: MarkedDaysMap | ((prev: MarkedDaysMap) => MarkedDaysMap)) => void;
  setLayout: (layout: LayoutType) => void;
  setDayNumberSize: (size: DayNumberSize) => void;
  setDayTextSize: (dayTextSize: DayTextSize) => void;
  setDayNumberPosition: (position: DayNumberPosition, onBlocked?: () => void, onDeflected?: (newNotePos: DayNumberPosition) => void) => void;
  setDayNotePosition: (position: DayNumberPosition, onBlocked?: () => void, onDeflected?: (newNumPos: DayNumberPosition) => void) => void;
  setMonthRange: (range: MonthRange) => void;
}

export const useCalendarStore = create<CalendarState>()(
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
      dayNumberPosition: 'center',
      dayNotePosition: 'bottom-left',
      monthRange: { start: 1, end: 12 },
      setYear: (year) => set({ year }),
      setPalette: (palette) => set({ palette }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setWeekStart: (weekStart) => set({ weekStart }),
      setHighlightWeekends: (highlightWeekends) => set({ highlightWeekends }),
      setSubtitle: (subtitle) => set({ subtitle }),
      setMarkedDays: (markedDays) => set((state) => ({
        markedDays: typeof markedDays === 'function' ? markedDays(state.markedDays) : markedDays
      })),
      setLayout: (layout) => set({ layout }),
      setDayNumberSize: (dayNumberSize) => set({ dayNumberSize }),
      setDayTextSize: (dayTextSize) => set({ dayTextSize }),
      setDayNumberPosition: (dayNumberPosition, onBlocked, onDeflected) => {
        if (hasHolidayMarked(get().markedDays) && isMiddleRow(dayNumberPosition)) {
          onBlocked?.();
          return;
        }

        if (isBottomRow(dayNumberPosition) && isBottomRow(get().dayNotePosition)) {
          const newNotePos = dayNumberPosition.replace('bottom', 'top') as DayNumberPosition;
          set({ dayNumberPosition, dayNotePosition: newNotePos });
          onDeflected?.(newNotePos);
        } else {
          set({ dayNumberPosition });
        }
      },
      setDayNotePosition: (dayNotePosition, onBlocked, onDeflected) => {
        if (hasHolidayMarked(get().markedDays) && isMiddleRow(dayNotePosition)) {
          onBlocked?.();
          return;
        }

        if (isBottomRow(dayNotePosition) && isBottomRow(get().dayNumberPosition)) {
          const newNumPos = dayNotePosition.replace('bottom', 'top') as DayNumberPosition;
          set({ dayNotePosition, dayNumberPosition: newNumPos });
          onDeflected?.(newNumPos);
        } else {
          set({ dayNotePosition });
        }
      },
      setMonthRange: (monthRange) => set({ monthRange }),
    }),
    {
      name: 'print-calendar-storage',
    }
  )
);

