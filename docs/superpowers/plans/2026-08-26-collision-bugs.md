# Plan: Collision Bugs Fixes

Goal: Implement position validations, button disabling in pickers, and correct deflections.

---

### Task 1: Store position validation & global deflection updates

**Files:**
- Modify: `src/store/useCalendarStore.ts`

- [ ] **Step 1: Update Store Setters**
  - Block note placement if it is identical to number position (instead of auto-deflecting bottom row, we just block).
  - Implement full-quadrant deflection in `setDayNumberPosition`: if `newNumberPos === currentNotePos`, deflect the note using `OPPOSITE_POSITIONS` logic.
- [ ] **Step 2: Verification with npm run lint & build**
- [ ] **Step 3: Commit**

---

### Task 2: Implement disabled positions in DayPositionPicker

**Files:**
- Modify: `src/components/DayPositionPicker.tsx`

- [ ] **Step 1: Add `disabledPositions` prop and style disabled buttons**
  - Disable clicks. Add opacity-40 and cursor-not-allowed.
- [ ] **Step 2: Verification**
- [ ] **Step 3: Commit**

---

### Task 3: Coordinate pickers in ControlToolbar

**Files:**
- Modify: `src/components/ControlToolbar.tsx`

- [ ] **Step 1: Compute disabled positions list for each picker and pass them**
- [ ] **Step 2: Verification**
- [ ] **Step 3: Commit**

---

### Task 4: Resolve Note Position on Holidays

**Files:**
- Modify: `src/components/CalendarMonth.tsx`

- [ ] **Step 1: Update resolveNotePosition to deflect note position if it lands on a holiday**
- [ ] **Step 2: Verification & Walkthrough**
- [ ] **Step 3: Commit**
