# Layouts and Local Storage Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement automatic local storage persistence using Zustand and introduce CSS-paginated layouts (Annual, Biannual, Quarterly, Monthly) for accurate print WYSIWYG.

**Architecture:** We are using Zustand with its `persist` middleware to handle state and localStorage transparently. The `CalendarCanvas` will be refactored to chunk the 12 months into CSS "pages" based on the selected layout, using `@media print { break-after: page }` to ensure perfect A4 printing.

**Tech Stack:** React, Tailwind CSS, Zustand, TypeScript.

**Spec:** `docs/superpowers/specs/2026-08-25-layouts-and-persistence-design.md`

## Global Constraints

- Must work in modern browsers.
- Print layouts must target A4 landscape.
- No data loss on page refresh (transparent persistence).

---

### Task 1: Setup Zustand Store

**Files:**
- Create: `src/store/useCalendarStore.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `useCalendarStore` hook with state and setters.

- [ ] **Step 1: Install zustand**

```bash
npm install zustand
```

- [ ] **Step 2: Create the store with persist middleware**

```typescript
// src/store/useCalendarStore.ts
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
```

- [ ] **Step 3: Run typescript compiler to verify types**

```bash
npm run lint
```
Expected: PASS (or errors unrelated to our new file)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/store/useCalendarStore.ts
git commit -m "feat: add zustand and create calendar store with persistence"
```

---

### Task 2: Update Types and Utils

**Files:**
- Modify: `src/types.ts`
- Modify: `src/utils/calendarHelper.ts`

**Interfaces:**
- Consumes: Existing Types
- Produces: `LayoutType`, `chunkMonths` helper.

- [ ] **Step 1: Add LayoutType to types.ts**

```typescript
// Add to src/types.ts
export type LayoutType = 'anual' | 'semestral' | 'trimestral' | 'mensual';
```

- [ ] **Step 2: Create chunkHelper in calendarHelper.ts**

```typescript
// Add to src/utils/calendarHelper.ts
import { MonthData } from '../types';

export function chunkMonths(months: MonthData[], layout: 'anual' | 'semestral' | 'trimestral' | 'mensual'): MonthData[][] {
  let chunkSize = 12;
  if (layout === 'semestral') chunkSize = 6;
  if (layout === 'trimestral') chunkSize = 3;
  if (layout === 'mensual') chunkSize = 1;

  const chunks: MonthData[][] = [];
  for (let i = 0; i < months.length; i += chunkSize) {
    chunks.push(months.slice(i, i + chunkSize));
  }
  return chunks;
}
```

- [ ] **Step 3: Verify typescript**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/utils/calendarHelper.ts
git commit -m "feat: add layout types and chunking helper"
```

---

### Task 3: Refactor ControlToolbar

**Files:**
- Modify: `src/components/ControlToolbar.tsx`

**Interfaces:**
- Consumes: `useCalendarStore`, `LayoutType`
- Produces: Updated Toolbar UI.

- [ ] **Step 1: Update ControlToolbar to use the store and add Layout selector**

Replace the local state props with Zustand store hooks. Remove all props except `onPrint`, `onOpenHolidaysModal`, etc., or keep them if you prefer pure components, but for this refactor, it's cleaner to read from the store directly.

Wait, to avoid touching too many files, we can just update `ControlToolbar` to read `layout` and `setLayout` from the store, and keep other props for now, OR refactor it fully. Let's refactor it fully to use the store.

```tsx
// src/components/ControlToolbar.tsx (relevant parts to update)
import { useCalendarStore } from '../store/useCalendarStore';
import { PaletteKey, FontFamilyKey, WeekStart, LayoutType } from '../types';
// ... other imports

interface ControlToolbarProps {
  onPrint: () => void;
  onClearSelectedDays: () => void;
  onOpenHolidaysModal: () => void;
}

export function ControlToolbar({
  onPrint,
  onClearSelectedDays,
  onOpenHolidaysModal,
}: ControlToolbarProps) {
  const { 
    palette, setPalette, 
    fontFamily, setFontFamily, 
    weekStart, setWeekStart, 
    highlightWeekends, setHighlightWeekends, 
    subtitle, setSubtitle,
    layout, setLayout,
    markedDays
  } = useCalendarStore();
  
  const selectedCount = Object.keys(markedDays).length;

  return (
    // ... existing JSX ...
    // Add this select near the font family selector:
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Layout
      </label>
      <select
        className="select select-bordered select-sm w-full font-medium"
        value={layout}
        onChange={(e) => setLayout(e.target.value as LayoutType)}
      >
        <option value="anual">Anual (12 meses)</option>
        <option value="semestral">Semestral (6 meses)</option>
        <option value="trimestral">Trimestral (3 meses)</option>
        <option value="mensual">Mensual (1 mes)</option>
      </select>
    </div>
    // ... rest of the JSX updated to use store variables instead of props
  );
}
```

- [ ] **Step 2: Run build to verify no syntax errors**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ControlToolbar.tsx
git commit -m "refactor: connect toolbar to zustand and add layout selector"
```

---

### Task 4: Refactor App.tsx to use Zustand

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useCalendarStore`, updated `ControlToolbar`

- [ ] **Step 1: Remove local state in App.tsx**

Remove the `useState` hooks for `palette`, `fontFamily`, `weekStart`, `highlightWeekends`, `subtitle`, `markedDays`.
Replace them with the Zustand store.

```tsx
// src/App.tsx
import { useCalendarStore } from './store/useCalendarStore';
// ... other imports

export default function App() {
  const { 
    palette, fontFamily, weekStart, highlightWeekends, subtitle, markedDays, setMarkedDays 
  } = useCalendarStore();
  
  const [isHolidaysModalOpen, setIsHolidaysModalOpen] = useState<boolean>(false);
  // ... keep modal states ...

  // Update handlers that used local setMarkedDays to use the store's setMarkedDays
  // Update ControlToolbar and CalendarCanvas to pass fewer props if refactored, or pass the store variables.
```

- [ ] **Step 2: Verify typescript**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: migrate App state to zustand store"
```

---

### Task 5: Refactor CalendarCanvas for CSS Pagination

**Files:**
- Modify: `src/components/CalendarCanvas.tsx`

**Interfaces:**
- Consumes: `chunkMonths`, `LayoutType`

- [ ] **Step 1: Implement pagination in CalendarCanvas**

```tsx
// src/components/CalendarCanvas.tsx
import { useCalendarStore } from '../store/useCalendarStore';
import { chunkMonths } from '../utils/calendarHelper';
// ... other imports

// Update props if needed, but assuming it reads layout from store or props:
export function CalendarCanvas({
  months,
  palette,
  fontFamily,
  weekStart,
  highlightWeekends,
  subtitle,
  markedDays,
  onSelectDay,
}: CalendarCanvasProps) {
  const layout = useCalendarStore((s) => s.layout);
  const pages = chunkMonths(months, layout);

  return (
    <div className="w-full flex flex-col items-center gap-8 print:block print:gap-0">
      {pages.map((pageMonths, pageIndex) => (
        <div 
          key={pageIndex} 
          className="page-a4 w-[297mm] h-[210mm] bg-white shadow-xl flex flex-col overflow-hidden shrink-0 print:shadow-none print:m-0 print:break-after-page"
        >
          {/* Header */}
          <header className="pt-8 px-10 pb-4 shrink-0 flex items-end justify-between">
            <div className="flex flex-col">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                2027
              </h1>
              {subtitle && (
                <h2 className="text-lg font-medium text-slate-500 mt-1">
                  {subtitle}
                </h2>
              )}
            </div>
          </header>

          {/* Grid Layout depending on pageMonths.length */}
          <div className={`flex-1 p-10 pt-4 grid gap-x-8 gap-y-6 ${
            layout === 'anual' ? 'grid-cols-4 grid-rows-3' :
            layout === 'semestral' ? 'grid-cols-3 grid-rows-2' :
            layout === 'trimestral' ? 'grid-cols-3 grid-rows-1' :
            'grid-cols-1 grid-rows-1'
          }`}>
            {pageMonths.map((month) => (
              <MonthBlock
                key={month.monthNumber}
                month={month}
                // ... pass existing props ...
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and test manually**

```bash
npm run dev
```
Action: Open browser, change layout in toolbar. Verify that chunks are created correctly (e.g., 2 pages for Semestral, 4 for Trimestral). Open print dialog (`Ctrl+P`) and verify each chunk occupies one landscape A4 page. Verify reloading the page keeps the state.

- [ ] **Step 3: Commit**

```bash
git add src/components/CalendarCanvas.tsx
git commit -m "feat: implement chunked layout pagination with print page breaks"
```
