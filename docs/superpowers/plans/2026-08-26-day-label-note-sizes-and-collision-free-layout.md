# Day Label & Note Sizes and Collision-Free Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Allow users to customize the font size of day labels and notes, and ensure day numbers, label badges, and note text are positioned within monthly day cells without collisions or layout overflow.

**Architecture:** Add dayTextSize: 'sm' | 'md' | 'lg' to src/types.ts and useCalendarStore.ts. Add a control in ControlToolbar.tsx for configuring text sizes. In CalendarMonth.tsx, implement intelligent collision-free ordering (e.g. lex-col vs lex-col-reverse depending on dayNumberPosition) and proportional font/line-clamp scaling for badges and notes.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, DaisyUI, Zustand.

## Global Constraints
- Must work across modern desktop and mobile browsers.
- Print output in A4 landscape must maintain 100% WYSIWYG fidelity without text clipping or overflowing monthly cells.
- Transparent persistence: all new configurations must persist to localStorage automatically via Zustand.

---

### Task 1: Extend Types & Zustand Store

**Files:**
- Modify: src/types.ts
- Modify: src/store/useCalendarStore.ts

**Interfaces:**
- Produces: DayTextSize = 'sm' | 'md' | 'lg', dayTextSize: DayTextSize, setDayTextSize: (size: DayTextSize) => void

- [ ] **Step 1: Add DayTextSize type in src/types.ts**
- [ ] **Step 2: Add dayTextSize state and setter in src/store/useCalendarStore.ts**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 2: Add Day Text Size Selector to ControlToolbar.tsx

**Files:**
- Modify: src/components/ControlToolbar.tsx

**Interfaces:**
- Consumes: useCalendarStore((state) => ({ dayTextSize: state.dayTextSize, setDayTextSize: state.setDayTextSize }))

- [ ] **Step 1: Add Day Text Size control in ControlToolbar.tsx under "Ajustes del Día y Semana"**
- [ ] **Step 2: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 3: Commit**

---

### Task 3: Implement Collision-free Layout & Dynamic Sizing in CalendarMonth.tsx

**Files:**
- Modify: src/components/CalendarMonth.tsx

**Interfaces:**
- Consumes: dayTextSize, dayNumberPosition, dayNumberSize, layout

- [ ] **Step 1: Define text sizing maps for labels and notes in CalendarMonth.tsx**
- [ ] **Step 2: Implement dynamic directional flow (top vs bottom vs center day number)**
- [ ] **Step 3: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 4: Commit**

---

### Task 4: Full End-to-End Verification and Build

- [ ] **Step 1: Execute full linter and build test**
- [ ] **Step 2: Update walkthrough document**
