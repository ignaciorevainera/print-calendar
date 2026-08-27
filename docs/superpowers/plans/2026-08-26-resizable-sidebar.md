# Plan de Implementación de Barra Lateral Redimensionable

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer que la barra lateral (sidebar) tenga un ancho mínimo mayor (360px por defecto) y que el usuario pueda cambiar el ancho de forma interactiva arrastrando el borde izquierdo de la barra.

**Architecture:**
1. Crear un estado local en `ControlToolbar.tsx` para almacenar el ancho actual de la barra lateral (`sidebarWidth`, default 360px) y un estado de control de arrastre (`isDragging`).
2. Añadir un manejador de eventos `mousedown` en un div de borde flotante absolute ubicado a la izquierda de la barra lateral.
3. Al arrastrar, escuchar eventos `mousemove` y `mouseup` de manera global en `window`.
4. Calcular el nuevo ancho dinámicamente como `window.innerWidth - e.clientX`, limitándolo entre un mínimo de 360px y un máximo de 600px.
5. Quitar la animación de transición CSS temporalmente durante el arrastre (`isDragging === true`) para que la respuesta visual sea instantánea y fluida.

**Tech Stack:** React, Tailwind CSS, TypeScript.

---

### Task 1: Agregar Lógica de Arrastre (Resize) y Redimensionamiento en ControlToolbar.tsx

**Files:**
- Modify: `src/components/ControlToolbar.tsx`

**Interfaces:**
- Consumes: Ancho de pantalla global, eventos de cursor.
- Produces: Sidebar con ancho dinámico reactivo al arrastre del mouse.

- [ ] **Step 1: Definir los estados en `ControlToolbar.tsx`**
  Agregar `width` (360) e `isDragging` (false) usando hooks de React.

- [ ] **Step 2: Implementar la función de redimensionamiento con `useEffect`**
  Registrar eventos `mousemove` y `mouseup` globales únicamente cuando `isDragging` sea `true`:
  ```typescript
  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= 600) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  ```

- [ ] **Step 3: Aplicar estilos y añadir el tirador (handle) visual en el JSX**
  - Reemplazar la clase de ancho fijo `w-80` por estilos en línea `style={{ width: isOpen ? `${width}px` : '0px' }}` en el elemento `<aside>`.
  - Agregar la clase `transition-none` cuando `isDragging` esté activo.
  - Insertar el div tirador en el extremo izquierdo absoluto del `<aside>`:
    ```tsx
    <div
      onMouseDown={startDragging}
      className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/40 active:bg-primary transition-colors z-50"
      style={{ touchAction: 'none' }}
    />
    ```

- [ ] **Step 4: Verificar compilación y formateo**
  Ejecutar `npm run lint` y `npm run build` para asegurar que compila perfectamente.

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/ControlToolbar.tsx
  git commit -m "feat(sidebar): implement resizable width drag handle with clamp limits"
  ```
