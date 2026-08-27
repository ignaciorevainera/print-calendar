# Plan de Corrección de Superposición y Recorte de Menús y Dropdowns en la Sidebar

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Solucionar el recorte horizontal y vertical de los menús dropdown en la barra lateral (selectores 3x3 de alineación de número y nota, y menú rápido de rango de meses), asegurando que se desplieguen por encima de los demás elementos sin quedar ocultos ni cortados.

**Architecture:** Modificar el CSS de DaisyUI para permitir `overflow: visible` en acordeones `.collapse` expandidos, gestionar el contexto de apilamiento (`z-index` dinámico mediante `focus-within` en secciones), y ajustar las clases de alineación horizontal (`dropdown-start` y `dropdown-end`) en los `DayPositionPicker` para que el menú emergente 3x3 se expanda hacia el centro de la barra lateral en lugar de desbordarse por los bordes laterales.

**Tech Stack:** React 19, Tailwind CSS 4, DaisyUI 5, TypeScript, Zustand, Lucide React.

---

### Task 1: Habilitar desbordamiento visual y stacking context para acordeones y dropdowns en index.css y ControlToolbar.tsx

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/ControlToolbar.tsx`

**Interfaces:**
- Consumes: Clases estándar de DaisyUI `.collapse`, `.collapse-content`, `.dropdown`, `.dropdown-content`.
- Produces: Reglas CSS para que los contenedores colapsables abiertos (`:has(> input:checked)`) no recorten los elementos flotantes con `overflow: visible`, y gestionen el apilamiento `focus-within:z-30`.

- [ ] **Step 1: Añadir reglas de overflow y z-index en `src/index.css`**
  Permitir que los dropdowns se proyecten fuera del contenedor cuando el colapsable esté expandido y elevar el `z-index` de la sección activa:
  ```css
  /* Permitir que dropdowns y menús emergentes floten sobre los acordeones abiertos */
  .collapse:has(> input:checked) {
    overflow: visible;
  }
  .collapse:has(> input:checked) .collapse-content {
    overflow: visible;
  }
  .collapse:focus-within {
    z-index: 30;
  }
  ```

- [ ] **Step 2: Actualizar `ControlToolbar.tsx` con clases de elevación de capas**
  Asegurar que cada sección colapsable tenga `relative focus-within:z-30 transition-[z-index]` y que el dropdown de acceso rápido de meses use `z-[100]`.

- [ ] **Step 3: Verificar compilación**
  Ejecutar: `npm run lint` y `npm run build`
  Resultado esperado: Sin errores de tipos ni de bundler.

- [ ] **Step 4: Commit**
  ```bash
  git add src/index.css src/components/ControlToolbar.tsx
  git commit -m "fix(sidebar): enable overflow visibility and focus stacking for open collapse sections"
  ```

---

### Task 2: Ajustar orientación y ancho de los selectores 3x3 en DayPositionPicker.tsx y ControlToolbar.tsx

**Files:**
- Modify: `src/components/DayPositionPicker.tsx`
- Modify: `src/components/ControlToolbar.tsx`

**Interfaces:**
- Consumes: Props de `DayPositionPickerProps` (`pickerType`, `align`).
- Produces: Posicionamiento contextual de la ventana flotante 3x3 (`dropdown-start` para columna izquierda, `dropdown-end` para columna derecha) y `z-[100]` con ancho optimizado (`w-44`) para garantizar que quede 100% dentro del ancho visible de la barra lateral.

- [ ] **Step 1: Añadir prop opcional de alineación de dropdown o derivarla de `pickerType` en `DayPositionPicker.tsx`**
  Configurar para que la alineación de número (columna izquierda) use `dropdown-start` (desplegándose hacia la derecha, dentro del sidebar) y la alineación de nota (columna derecha) use `dropdown-end` (desplegándose hacia la izquierda, dentro del sidebar).
  Elevar el z-index de `.dropdown-content` a `z-[100]`.

- [ ] **Step 2: Verificar en `ControlToolbar.tsx` la correcta integración**
  Pasar las propiedades requeridas y verificar el espacio disponible en la grilla 2x2 de Section 3.

- [ ] **Step 3: Verificar compilación**
  Ejecutar: `npm run lint` y `npm run build`
  Resultado esperado: PASS limpio.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/DayPositionPicker.tsx src/components/ControlToolbar.tsx
  git commit -m "fix(picker): prevent horizontal clipping by adapting dropdown direction and z-index"
  ```
