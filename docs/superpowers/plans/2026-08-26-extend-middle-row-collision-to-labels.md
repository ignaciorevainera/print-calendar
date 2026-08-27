# Plan: Extend Middle Row Collision to Labels/Badges

Goal: Restrict middle-row alignment selections for both numbers and notes if there are either holidays or custom day label badges.

---

### Task 1: Update Store validation helpers

**Files:**
- Modify: src/store/useCalendarStore.ts

- [ ] **Step 1: Replace hasHolidayMarked with hasHolidayOrLabelMarked**
- [ ] **Step 2: Update setter validations**
- [ ] **Step 3: Verification with npm run lint & build**
- [ ] **Step 4: Commit**

---

### Task 2: Update ControlToolbar disabled conditions

**Files:**
- Modify: src/components/ControlToolbar.tsx

- [ ] **Step 1: Update hasHolidaysOrLabels calculation**
- [ ] **Step 2: Pass updated disabled positions to pickers**
- [ ] **Step 3: Verification with npm run lint & build**
- [ ] **Step 4: Commit**

---

### Task 3: Update App auto-deflection checks

**Files:**
- Modify: src/App.tsx

- [ ] **Step 1: Update checkAndResetMiddlePositions**
- [ ] **Step 2: Verification, final build, and Walkthrough**
- [ ] **Step 3: Commit**
