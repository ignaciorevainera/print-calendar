# Plan: Font Size Selectors for Month Name, Year, and Subtitle

Goal: Add independent font size selectors for month titles and page headers (year and subtitle) with persistent Zustand state.

---

### Task 1: Add types & store state

**Files:**
- Modify: src/types.ts
- Modify: src/store/useCalendarStore.ts

- [ ] **Step 1: Add HeaderTitleSize and MonthTitleSize types**
- [ ] **Step 2: Add state and setters to Zustand store**
- [ ] **Step 3: Verification with npm run lint & build**
- [ ] **Step 4: Commit**

---

### Task 2: Apply dynamic sizing in CalendarCanvas.tsx and CalendarMonth.tsx

**Files:**
- Modify: src/components/CalendarCanvas.tsx
- Modify: src/components/CalendarMonth.tsx

- [ ] **Step 1: Implement headerTitleSizeMap in CalendarCanvas.tsx**
- [ ] **Step 2: Implement monthTitleSizeMap in CalendarMonth.tsx**
- [ ] **Step 3: Verification with npm run lint & build**
- [ ] **Step 4: Commit**

---

### Task 3: Add selectors to ControlToolbar.tsx

**Files:**
- Modify: src/components/ControlToolbar.tsx

- [ ] **Step 1: Add "Tamaño de encabezado" dropdown to Card Group 1**
- [ ] **Step 2: Add "Tamaño del mes" dropdown to Card Group 3**
- [ ] **Step 3: Verification, final build, and Walkthrough**
- [ ] **Step 4: Commit**
