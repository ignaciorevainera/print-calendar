# Plan: Equal Height Vertical Cell Expansion

Goal: Ensure day cells expand to fill 100% of the available month card height across all layouts (anual, semestral, trimestral, mensual) using CSS Grid epeat(N, minmax(0, 1fr)).

---

### Task 1: Refactor CalendarMonth.tsx weeks layout to CSS Grid epeat(N, minmax(0, 1fr))

**Files:**
- Modify: src/components/CalendarMonth.tsx

- [ ] **Step 1: Replace flex week container with CSS Grid epeat(month.weeks.length, minmax(0, 1fr))**
- [ ] **Step 2: Update week row wrapper to grid grid-cols-7 w-full h-full min-h-0**
- [ ] **Step 3: Update cell wrapper to w-full h-full min-h-0**
- [ ] **Step 4: Verification with 
pm run lint & 
pm run build**
- [ ] **Step 5: Commit**
