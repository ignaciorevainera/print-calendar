# Day Customization and Month Range Design

## Overview
This feature adds advanced day cell typography customization and selective month range printing to the calendar application:
1. **Day Number Size**: Configurable font size presets (`sm`, `md`, `lg`, `xl`).
2. **Day Number 3x3 Position**: 9-quadrant positioning within each day cell (top/center/bottom + left/center/right) selectable via an interactive 3x3 visual matrix popover.
3. **Selective Month Range**: Flexible range selection ("Desde" / "Hasta") allowing printing/displaying a single month (e.g. March only), arbitrary spans (e.g. March to October), or the full year (January to December).

## Architecture

We implement **Approach A**: Modular State in Zustand + Reusable 3x3 Grid Picker Component.

### 1. State Management (`src/store/useCalendarStore.ts`)
Add the following fields to `CalendarState`:
- `dayNumberSize`: `DayNumberSize` (default: `'md'`)
- `dayNumberPosition`: `DayNumberPosition` (default: `'center'`)
- `monthRange`: `{ start: number; end: number }` (1-indexed: 1 for January, 12 for December; default: `{ start: 1, end: 12 }`)
- Setters:
  - `setDayNumberSize(size: DayNumberSize): void`
  - `setDayNumberPosition(pos: DayNumberPosition): void`
  - `setMonthRange(range: { start: number; end: number }): void`

All states persist automatically to `localStorage` via the existing `persist` middleware.

### 2. Type Definitions (`src/types.ts`)
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

### 3. Component Updates

#### A. New Component: `src/components/DayPositionPicker.tsx`
- Interactive 3x3 matrix rendered inside a DaisyUI dropdown/popover.
- Displays 9 square buttons representing quadrants.
- Active quadrant is visually highlighted with DaisyUI `btn-primary` or active badge styling.
- Clicking a quadrant immediately dispatches `setDayNumberPosition(position)`.

#### B. `src/components/ControlToolbar.tsx`
- Adds:
  1. **Day Number Size Selector**: Dropdown options:
     - Pequeño (`sm`)
     - Normal (`md`)
     - Grande (`lg`)
     - Extra Grande (`xl`)
  2. **Day Position Dropdown**: Renders `<DayPositionPicker />`.
  3. **Month Range Filter**:
     - "Desde" select (1: Enero to 12: Diciembre).
     - "Hasta" select (1: Enero to 12: Diciembre).
     - Quick action buttons/presets: "Todo el año" (`{ start: 1, end: 12 }`) and "Mes actual/único".
     - Guard: If `start > end`, updating `start` shifts `end` to match, and updating `end` shifts `start` if `end < start`.

#### C. `src/components/CalendarMonth.tsx`
- Reads `dayNumberSize` and `dayNumberPosition` from `useCalendarStore`.
- Class mapping for Position (flexbox):
  - `top-left`: `items-start justify-start p-0.5`
  - `top-center`: `items-start justify-center pt-0.5`
  - `top-right`: `items-start justify-end p-0.5`
  - `middle-left`: `items-center justify-start pl-0.5`
  - `center`: `items-center justify-center`
  - `middle-right`: `items-center justify-end pr-0.5`
  - `bottom-left`: `items-end justify-start p-0.5`
  - `bottom-center`: `items-end justify-center pb-0.5`
  - `bottom-right`: `items-end justify-end p-0.5`
- Class mapping for Font Size:
  - `sm`: `text-[8px] md:text-[9px]`
  - `md`: `text-[10px] md:text-[11px]`
  - `lg`: `text-[12px] md:text-[14px]`
  - `xl`: `text-[15px] md:text-[17px]`

#### D. `src/App.tsx`
- Reads `monthRange` from `useCalendarStore`.
- Filters `monthsData`:
  ```typescript
  const visibleMonths = useMemo(() => {
    return monthsData.filter((m) => {
      const monthNum = m.monthIndex + 1;
      return monthNum >= monthRange.start && monthNum <= monthRange.end;
    });
  }, [monthsData, monthRange]);
  ```
- Passes `visibleMonths` to `CalendarCanvas`.
- `CalendarCanvas` naturally chunks whatever months are passed to it according to the active `layout`.

## Data Flow
1. User adjusts size, 3x3 position, or month range in toolbar.
2. Actions update Zustand store and save to `localStorage`.
3. `CalendarMonth` re-renders day numbers with requested size and flexbox quadrant alignment.
4. `App.tsx` filters `monthsData` based on `monthRange`, and `CalendarCanvas` calculates page sheets and print breaks accordingly.

## Verification Plan
- Unit/Type checking: `npm run lint` with 0 TypeScript errors.
- Production build: `npm run build` succeeds.
- Visual & Functional checks:
  - Verify all 9 positions align the day numbers correctly within each cell.
  - Verify size selector changes day number font size immediately across all months.
  - Verify filtering to a single month (e.g., Enero to Enero) produces exactly 1 month on screen and in print preview.
  - Verify refresh retains selected size, position, and month range.
