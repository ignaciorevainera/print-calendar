# Day Notes and Monthly Layout Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Enable users to add detailed descriptive text/notes to marked calendar days in addition to brief labels, and display these notes and badges exclusively when viewing the single-month layout (layout === 'mensual').

**Architecture:** Extend MarkedDayInfo with a 
ote?: string field in src/types.ts. Update DayColorModal.tsx to include a multi-line text input for detailed notes alongside the color picker and short label. Update CalendarMonth.tsx to conditionally render the structured label badge and note text only when layout === 'mensual', while maintaining the clean compact day-number-only presentation in annual, biannual, and quarterly layouts.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, DaisyUI, Zustand (localStorage persistence).

## Global Constraints
- Must work across modern desktop and mobile browsers.
- Print output in A4 landscape must maintain 100% WYSIWYG fidelity without text clipping.
- Transparent persistence: all new fields must persist to localStorage automatically via Zustand.

---

### Task 1: Extend Types and Store Handlers

**Files:**
- Modify: src/types.ts
- Modify: src/App.tsx

**Interfaces:**
- Produces: MarkedDayInfo.note?: string
- Updates: handleConfirmMarkDay(color: string, label?: string, note?: string) in App.tsx

- [ ] **Step 1: Update MarkedDayInfo in src/types.ts**
- [ ] **Step 2: Update handleConfirmMarkDay in src/App.tsx**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 2: Add Multi-line Note Input in DayColorModal.tsx

**Files:**
- Modify: src/components/DayColorModal.tsx

**Interfaces:**
- Consumes: MarkedDayInfo.note
- Produces: onConfirm: (color: string, label?: string, note?: string) => void

- [ ] **Step 1: Update Props and State in DayColorModal.tsx**
- [ ] **Step 2: Add Textarea in Modal Body**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 3: Render Notes and Badges in Monthly Layout in CalendarMonth.tsx

**Files:**
- Modify: src/components/CalendarMonth.tsx

**Interfaces:**
- Consumes: useCalendarStore((state) => state.layout)
- Renders:
  - When layout === 'mensual': Day number + label badge + note text block.
  - When layout !== 'mensual': Day number only.

- [ ] **Step 1: Access layout in CalendarMonth.tsx**
- [ ] **Step 2: Update Day Cell Button Layout for Monthly View**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 4: Full End-to-End Verification and Build

- [ ] **Step 1: Execute full linter and build test**
- [ ] **Step 2: Update walkthrough document**
