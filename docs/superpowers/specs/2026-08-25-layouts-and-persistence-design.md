# Layouts and Local Storage Persistence

## Overview
This feature introduces two major enhancements to the print-calendar application:
1. **Persistent State**: Auto-saving the calendar configuration and marked days so data isn't lost on reload.
2. **Paginated Layouts**: Providing different page layout options (Annual, Biannual, Quarterly, Monthly) that visually represent physical A4 pages on screen and print perfectly.

## Architecture

We will implement **Approach B** (Zustand Persist + CSS Page Breaks).

### 1. State Management (Zustand)
- Install `zustand`.
- Create `src/store/useCalendarStore.ts`.
- Move all calendar state from `App.tsx` into this store:
  - `year`: number
  - `palette`: PaletteKey
  - `fontFamily`: FontFamilyKey
  - `weekStart`: WeekStart
  - `highlightWeekends`: boolean
  - `subtitle`: string
  - `markedDays`: MarkedDaysMap
  - `layout`: LayoutType (new)
- Use Zustand's `persist` middleware with the key `print-calendar-storage`.

### 2. Layout Definitions
- Add `LayoutType` to `src/types.ts`: `'anual' | 'semestral' | 'trimestral' | 'mensual'`.
- Define chunk sizes:
  - Anual: 12 months/page (Grid 4x3)
  - Semestral: 6 months/page (Grid 3x2)
  - Trimestral: 3 months/page (Grid 3x1)
  - Mensual: 1 month/page (Grid 1x1, expanded view)

### 3. Component Updates

**ControlToolbar.tsx**
- Add a new dropdown selector for `LayoutType`.
- Update to consume `useCalendarStore` directly.

**CalendarCanvas.tsx**
- Refactor to consume the layout state.
- Create a helper to chunk the `months` array based on the active `LayoutType`.
- Map over the chunks. For each chunk, render a `.page-a4` wrapper.
- `.page-a4` CSS:
  - Screen: `w-[297mm] h-[210mm] bg-white shadow-lg mx-auto mb-8 flex flex-col p-8 overflow-hidden` (landscape A4).
  - Print: `@media print { w-[297mm] h-[210mm] shadow-none m-0 p-0 break-after-page }`.
- Ensure the internal grid of months adjusts its columns/rows depending on the layout to fill the page beautifully.

**App.tsx**
- Remove local `useState` hooks for persistent calendar properties.
- Connect to `useCalendarStore` only where necessary.
- Retain local UI state for modals (`activeDayModal`, `isHolidaysModalOpen`, `toastMessage`).

### 4. Data Flow
1. User interacts with UI (changes color, selects layout).
2. Action is dispatched to `useCalendarStore`.
3. Zustand updates state and persists it to `localStorage`.
4. React re-renders. `CalendarCanvas` chunks the months and renders the new pages.
5. Printing natively relies on CSS `page-break-after`.

### 5. Error Handling
- Zustand persist handles JSON parsing errors natively. If data is corrupt, it falls back to the initial state.
- Invalid dates or missing colors will fallback to defaults as they do now.
