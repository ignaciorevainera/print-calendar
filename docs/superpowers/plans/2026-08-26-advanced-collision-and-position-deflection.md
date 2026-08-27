# Advanced Collision & Position Deflection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Implement full validation, notifications, and auto-deflection rules for day numbers, holiday badges, and descriptive notes to guarantee zero collision in the monthly layout.

**Architecture:** Extend Zustand store setters with validation hooks. Centralize toast dispatching in App.tsx or components using callback mechanisms. Update CalendarMonth.tsx monthly cell layout to anchor holiday badges across the full middle horizontal sector.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Zustand.

## Global Constraints
- Modern browser compatibility & A4 landscape print fidelity.
- Transparent persistence to localStorage.

---

### Task 1: Update Store Setters & Auto-Deflection Rules

**Files:**
- Modify: src/store/useCalendarStore.ts

**Interfaces:**
- Produces: Updated setDayNumberPosition and setDayNotePosition with callbacks for Toast warnings.

- [ ] **Step 1: Implement hasHolidayMarked helper**
- [ ] **Step 2: Add validation & deflection logic in store setters**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 2: Update Layout & Holiday Rendering in CalendarMonth.tsx

**Files:**
- Modify: src/components/CalendarMonth.tsx

**Interfaces:**
- Renders: Holiday badges strictly across the full middle row (middle-left, center, middle-right area).

- [ ] **Step 1: Decouple holiday badges from number block and position them across the middle row**
- [ ] **Step 2: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 3: Commit**

---

### Task 3: Integrate Notifications and Holiday Modifiers in App & Toolbar

**Files:**
- Modify: src/components/ControlToolbar.tsx
- Modify: src/App.tsx

- [ ] **Step 1: Connect store callbacks to App's Toast notifier**
- [ ] **Step 2: Intercept holiday additions to automatically reset middle-anchored number/note positions**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 4: Full End-to-End Verification and Build

- [ ] **Step 1: Execute full linter and build test**
- [ ] **Step 2: Update walkthrough document**
