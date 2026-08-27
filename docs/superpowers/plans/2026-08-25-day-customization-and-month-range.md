# Day Customization and Month Range Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement customizable day number font sizes (`sm`, `md`, `lg`, `xl`), 9-quadrant (3x3 grid) number positioning within day cells, and selective month range filtering for screen and print views.

**Architecture:** We extend the existing Zustand store `useCalendarStore` with `dayNumberSize`, `dayNumberPosition`, and `monthRange`. A reusable `DayPositionPicker` component renders the 3x3 quadrant selector. `CalendarMonth` renders day numbers with the configured flex alignment and text size classes. `App.tsx` filters `monthsData` based on the active `monthRange` before rendering the chunked A4 pages.

**Tech Stack:** React, TypeScript, Tailwind CSS, DaisyUI, Zustand.

**Spec:** `docs/superpowers/specs/2026-08-25-day-customization-and-month-range-design.md`

## Global Constraints

- Must work in modern browsers and preserve A4 landscape print fidelity.
- All new configurations must persist automatically to `localStorage` via Zustand `persist`.
- Month range must safely clamp so `start <= end` (1 to 12).

---

### Task 1: Extend Types and Zustand Store

**Files:**
- Modify: `src/types.ts`
- Modify: `src/store/useCalendarStore.ts`

**Interfaces:**
- Produces: `DayNumberSize`, `DayNumberPosition`, `MonthRange` types and extended `useCalendarStore` with getters and setters.

- [ ] **Step 1: Add types in `src/types.ts`**

```typescript
export type DayNumberSize = 'sm' | 'md' | 'lg' | 'xl';

export type DayNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface MonthRange {
  start: number; // 1 to 12
  end: number;   // 1 to 12
}
```

- [ ] **Step 2: Update store in `src/store/useCalendarStore.ts`**

Add state fields and actions:
```typescript
import { 
  PaletteKey, 
  FontFamilyKey, 
  WeekStart, 
  MarkedDaysMap, 
  LayoutType, 
  DayNumberSize, 
  DayNumberPosition, 
  MonthRange 
} from '../types';

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
  dayNumberPosition: DayNumberPosition;
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
  setDayNumberPosition: (position: DayNumberPosition) => void;
  setMonthRange: (range: MonthRange) => void;
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
      dayNumberSize: 'md',
      dayNumberPosition: 'center',
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
      setDayNumberPosition: (dayNumberPosition) => set({ dayNumberPosition }),
      setMonthRange: (monthRange) => set({ monthRange }),
    }),
    {
      name: 'print-calendar-storage',
    }
  )
);
```

- [ ] **Step 3: Run typescript verification**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/store/useCalendarStore.ts
git commit -m "feat(store): add day size, position, and month range state"
```

---

### Task 2: Create DayPositionPicker Component

**Files:**
- Create: `src/components/DayPositionPicker.tsx`

**Interfaces:**
- Consumes: `useCalendarStore`, `DayNumberPosition`
- Produces: Interactive 3x3 quadrant selector dropdown component.

- [ ] **Step 1: Implement `src/components/DayPositionPicker.tsx`**

```tsx
import React from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import { DayNumberPosition } from '../types';
import { LayoutGrid } from 'lucide-react';

const POSITIONS: { id: DayNumberPosition; label: string }[][] = [
  [
    { id: 'top-left', label: '↖ Superior Izquierda' },
    { id: 'top-center', label: '↑ Superior Centro' },
    { id: 'top-right', label: '↗ Superior Derecha' },
  ],
  [
    { id: 'middle-left', label: '← Centro Izquierda' },
    { id: 'center', label: '• Centro' },
    { id: 'middle-right', label: '→ Centro Derecha' },
  ],
  [
    { id: 'bottom-left', label: '↙ Inferior Izquierda' },
    { id: 'bottom-center', label: '↓ Inferior Centro' },
    { id: 'bottom-right', label: '↘ Inferior Derecha' },
  ],
];

export const DayPositionPicker: React.FC = () => {
  const { dayNumberPosition, setDayNumberPosition } = useCalendarStore();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-sm btn-outline border-base-300 w-full justify-between gap-1.5 font-medium"
      >
        <span className="flex items-center gap-1.5 truncate">
          <LayoutGrid className="w-3.5 h-3.5 text-base-content/60" />
          <span className="capitalize">{dayNumberPosition.replace('-', ' ')}</span>
        </span>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-50 p-3 shadow-xl bg-base-100 rounded-box border border-base-300 w-44 mt-1"
      >
        <div className="text-[11px] font-bold text-base-content/70 mb-2 uppercase tracking-wider text-center">
          Posición (3×3)
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-base-200 rounded-lg">
          {POSITIONS.flat().map((pos) => {
            const isSelected = dayNumberPosition === pos.id;
            return (
              <button
                key={pos.id}
                type="button"
                onClick={() => setDayNumberPosition(pos.id)}
                title={pos.label}
                className={`h-9 rounded flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-content font-bold shadow-xs'
                    : 'bg-base-100 hover:bg-base-300 text-base-content/70'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSelected ? 'bg-primary-content' : 'bg-base-content/30'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Run build to verify component syntax**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/DayPositionPicker.tsx
git commit -m "feat(ui): add DayPositionPicker 3x3 matrix component"
```

---

### Task 3: Apply Size and Position in CalendarMonth

**Files:**
- Modify: `src/components/CalendarMonth.tsx`

**Interfaces:**
- Consumes: `useCalendarStore` (`dayNumberSize`, `dayNumberPosition`)

- [ ] **Step 1: Update day cell rendering in `src/components/CalendarMonth.tsx`**

1. Import `useCalendarStore` from `../store/useCalendarStore`.
2. Map `dayNumberPosition` to Flexbox classes:
```typescript
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
```
3. Map `dayNumberSize` to font size classes:
```typescript
const sizeClassMap: Record<DayNumberSize, string> = {
  sm: 'text-[8px] md:text-[9px]',
  md: 'text-[10px] md:text-[11px]',
  lg: 'text-[12px] md:text-[14px]',
  xl: 'text-[15px] md:text-[17px]',
};
```
4. Read `dayNumberSize` and `dayNumberPosition` from `useCalendarStore`.
5. Apply these classes to the day cell `<button>`:
```tsx
className={`w-full h-full min-h-0 m-0 rounded-xs flex cursor-pointer select-none leading-none box-border ${positionClassMap[dayNumberPosition]} ${sizeClassMap[dayNumberSize]} ...`}
```

- [ ] **Step 2: Run verification**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/CalendarMonth.tsx
git commit -m "feat(calendar): apply configurable day number size and 3x3 alignment"
```

---

### Task 4: Integrate Controls into ControlToolbar

**Files:**
- Modify: `src/components/ControlToolbar.tsx`

**Interfaces:**
- Consumes: `useCalendarStore`, `DayPositionPicker`, `DayNumberSize`, `MonthRange`

- [ ] **Step 1: Add controls in `src/components/ControlToolbar.tsx`**

1. Import `DayPositionPicker` from `./DayPositionPicker`.
2. Add month names array (1 to 12) for range selectors.
3. In `useCalendarStore`, read `dayNumberSize`, `setDayNumberSize`, `monthRange`, `setMonthRange`.
4. Add:
   - **Tamaño de números**: `<select>` with `sm` (Pequeño), `md` (Normal), `lg` (Grande), `xl` (Extra Grande).
   - **Posición (3x3)**: `<DayPositionPicker />`.
   - **Rango de meses**:
     - "Desde" select (1: Enero to 12: Diciembre).
     - "Hasta" select (1: Enero to 12: Diciembre).
     - Quick button: "Todo el año" / "Mes único".
     - Guard: Ensure `start <= end` when changing either select.

- [ ] **Step 2: Verify typescript and build**

```bash
npm run lint
npm run build
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ControlToolbar.tsx
git commit -m "feat(toolbar): add day size, position picker, and month range controls"
```

---

### Task 5: Integrate Month Range Filtering in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useCalendarStore` (`monthRange`), `monthsData`

- [ ] **Step 1: Filter `monthsData` in `src/App.tsx`**

1. Read `monthRange` from `useCalendarStore`:
```typescript
const { year, weekStart, monthRange } = useCalendarStore();
```
2. Filter the generated year data according to `monthRange`:
```typescript
const filteredMonthsData = useMemo(() => {
  const fullYear = generateYearData(year, weekStart);
  return fullYear.filter((m) => {
    const monthNum = m.monthIndex + 1;
    return monthNum >= monthRange.start && monthNum <= monthRange.end;
  });
}, [year, weekStart, monthRange]);
```
3. Pass `filteredMonthsData` to `CalendarCanvas`.

- [ ] **Step 2: Verify entire app build and lint**

```bash
npm run lint
npm run build
```
Expected: PASS with 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): filter visible months by active monthRange"
```
