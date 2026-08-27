# Calendario A4

Calendario anual interactivo para imprimir y exportar a PDF en formato A4 horizontal, para cualquier año y rango de meses. Permite marcar días con colores, añadir notas y etiquetas, y cargar festivos nacionales/autonómicos desde la API externa de Nager.Date.

## Características

- Calendario anual configurable (año, inicio de semana, rango de meses visibles).
- Marcado multicolor de días con etiqueta y nota opcionales.
- Carga de festivos oficiales por país y subdivisión vía API (Nager.Date).
- Posicionamiento configurable de número de día y nota en la celda.
- Temas de color (gris, monocromo, azul, oliva, terracota).
- Exportación a PDF mediante impresión en A4 horizontal (`@media print`).

## Requisitos

- Node.js (compatible con Vite 6).
- Dependencias instaladas vía `npm install` (o el gestor de paquetes del lockfile activo).

## Comandos

| Comando           | Descripción                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo en `0.0.0.0:3000` (`--host`).               |
| `npm run build`   | Build de producción con `vite build`.                              |
| `npm run lint`    | Typecheck (`tsc --noEmit`). No hay linter ni tests.               |
| `npm run clean`   | Elimina `dist/` y `server.js`.                                     |

## Arquitectura

- **SPA React 19 + Vite**, sin router. Entrada: `src/main.tsx` → `src/App.tsx`.
- **Estado global** en el store zustand `src/store/useCalendarStore.ts` (año, inicio de semana, días marcados, rango de meses, posición de elementos).
- **Lógica de calendario**: `src/utils/calendarHelper.ts` (`generateYearData`).
- **Festivos**: `src/services/holidayApi.ts` consume la API de Nager.Date. Los mapas de nombres en español de países/regiones viven ahí.
- **Estilos**: Tailwind v4 + daisyUI 5 vía `@tailwindcss/vite` (solo CSS, sin `tailwind.config`). Configuración de tema e impresión en `src/index.css`.
- **Alias de ruta** `@/*` → raíz del repo (configurado en `vite.config.ts` y `tsconfig.json`).

## Despliegue

Applet de Google AI Studio (Gemini) desplegado en Cloud Run. `metadata.json` declara `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. AI Studio inyecta `GEMINI_API_KEY` y `APP_URL` en runtime; no se hardcodean. `server.js` se genera en el pipeline de build de AI Studio y no está en el repositorio.

## Notas

- La interfaz y los comentarios del código están en **español**.
- En AI Studio, `DISABLE_HMR=true` desactiva HMR y el watch para evitar parpadeos durante ediciones automáticas; no modificar ese bloque en `vite.config.ts`.
- Al exportar a PDF, las clases `.no-print` se ocultan y `.page-a4` fuerza el formato A4 horizontal.
