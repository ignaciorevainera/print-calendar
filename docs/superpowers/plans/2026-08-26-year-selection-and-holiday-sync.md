# Year Selection and Holiday Synchronization Implementation Plan

Enable dynamic year selection in the calendar interface, ensuring accurate day-of-week generation (including leap years) and seamless synchronization with official holidays fetched via API for the selected year.

## Proposed Changes

### Component Layer

#### [MODIFY] [ControlToolbar.tsx](file:///e:/Dev/proyectos/print-calendar/src/components/ControlToolbar.tsx)
- Extract `setYear` from `useCalendarStore`.
- Add an interactive Year selector component within the "Contenido y Periodo" group:
  - Stepper controls (`‹` and `›` buttons) for single-click year navigation.
  - Number input / selector with validation (clamped between 1900 and 2100).
  - Dynamic subtitle placeholder (`Ej: ${year} · Planificador anual`).
- Organize "Contenido y Periodo" grid:
  - Row 1: **Año** (col-span-1) and **Subtítulo opcional** (col-span-1).
  - Row 2: **Rango de meses** (col-span-2).

#### [MODIFY] [HolidaysModal.tsx](file:///e:/Dev/proyectos/print-calendar/src/components/HolidaysModal.tsx)
- Ensure the modal displays the selected year prominently in header and holiday badges.
- Verify reactive holiday fetching whenever `year` or `selectedCountryCode` changes.

#### [MODIFY] [App.tsx](file:///e:/Dev/proyectos/print-calendar/src/App.tsx)
- Confirm `monthsData` recomputes reactively for leap years and correct weekday offsets.
- Pass updated `year` to `HolidaysModal` and `DayColorModal`.

---

## Verification Plan

### Automated Tests
- Run TypeScript linting and production bundling:
  ```bash
  npm run lint
  npm run build
  ```

### Manual Verification
- Change year to a leap year (e.g., 2024, 2028) and verify February has 29 days and starting weekdays match the real calendar.
- Change year to standard years (e.g., 2025, 2026, 2027) and verify February has 28 days.
- Open "Festivos Oficiales (API)" for different years and confirm that the API returns the correct holidays for that specific year (e.g. 2025 vs 2026 vs 2027).
- Verify responsive layout on mobile, tablet, and desktop.
