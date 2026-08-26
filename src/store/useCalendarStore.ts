import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaletteKey, FontFamilyKey, WeekStart, MarkedDaysMap, LayoutType } from '../types';

interface CalendarState {
  year: number;
  palette: PaletteKey;
  fontFamily: FontFamilyKey;
  weekStart: WeekStart;
  highlightWeekends: boolean;
  subtitle: string;
  markedDays: MarkedDaysMap;
  layout: LayoutType;
  setYear: (year: number) => void;
  setPalette: (palette: PaletteKey) => void;
  setFontFamily: (fontFamily: FontFamilyKey) => void;
  setWeekStart: (weekStart: WeekStart) => void;
  setHighlightWeekends: (highlight: boolean) => void;
  setSubtitle: (subtitle: string) => void;
  setMarkedDays: (markedDays: MarkedDaysMap | ((prev: MarkedDaysMap) => MarkedDaysMap)) => void;
  setLayout: (layout: LayoutType) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      year: 2027,
      palette: 'gris',
      fontFamily: 'jakarta',
      weekStart: 'monday',
      highlightWeekends: true,
      subtitle: '',
      markedDays: {},
      layout: 'anual',
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
    }),
    {
      name: 'print-calendar-storage',
    }
  )
);
