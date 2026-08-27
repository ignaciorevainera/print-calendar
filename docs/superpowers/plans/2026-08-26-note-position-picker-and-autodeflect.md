# Note Position Picker & Auto-Deflect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Enable users to position descriptive notes across 9 quadrants within monthly day cells using an interactive 3x3 picker, with auto-deflection to prevent collisions when the day number and note share the same quadrant.

**Architecture:** Add dayNotePosition: DayNumberPosition to Zustand store. Add a 3x3 position picker for notes in ControlToolbar.tsx. In CalendarMonth.tsx, implement esolveNotePosition(numberPos, notePos) to deflect matching positions to opposite quadrants, and render the day number + label badge in dayNumberPosition while placing note descriptions in the resolved dayNotePosition.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, DaisyUI, Zustand.

## Global Constraints
- Modern browser compatibility & A4 landscape print fidelity.
- Transparent persistence to localStorage.
- Zero overlap / collision between day number, label badge, and note text.

---

### Task 1: Extend Types & Zustand Store for Note Position

**Files:**
- Modify: src/store/useCalendarStore.ts

**Interfaces:**
- Produces: dayNotePosition: DayNumberPosition, setDayNotePosition: (pos: DayNumberPosition) => void

- [ ] **Step 1: Add dayNotePosition state & setter to useCalendarStore.ts**
- [ ] **Step 2: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 3: Commit**

---

### Task 2: Create Note Position Picker & Integrate in Toolbar

**Files:**
- Create/Modify: src/components/DayPositionPicker.tsx (or DayNotePositionPicker.tsx)
- Modify: src/components/ControlToolbar.tsx

**Interfaces:**
- Consumes: useCalendarStore((state) => ({ dayNotePosition: state.dayNotePosition, setDayNotePosition: state.setDayNotePosition }))

- [ ] **Step 1: Create or refactor position picker to support note position**
- [ ] **Step 2: Add "Alineación nota" control in ControlToolbar.tsx**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 3: Implement Auto-Deflect Collision Resolution & Render in CalendarMonth.tsx

**Files:**
- Modify: src/components/CalendarMonth.tsx

**Interfaces:**
- Consumes: dayNumberPosition, dayNotePosition, dayNumberSize, dayTextSize

- [ ] **Step 1: Implement esolveNotePosition(numberPos, notePos) helper**
- [ ] **Step 2: Render number + label badge in dayNumberPosition and note in resolved dayNotePosition**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 4: Full End-to-End Verification and Build

- [ ] **Step 1: Execute full linter and build test**
- [ ] **Step 2: Update walkthrough document**
