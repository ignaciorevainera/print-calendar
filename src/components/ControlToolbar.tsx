import React, { useState, useEffect } from 'react';
import { PaletteKey, FontFamilyKey, LayoutType, DayNumberSize, DayTextSize, DayNumberPosition } from '../types';
import { useCalendarStore } from '../store/useCalendarStore';
import { DayPositionPicker } from './DayPositionPicker';
import { 
  Printer, 
  Palette, 
  CalendarDays, 
  Type, 
  Sparkles, 
  Eraser, 
  Globe2, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface ControlToolbarProps {
  onPrint: () => void;
  onClearSelectedDays: () => void;
  onOpenHolidaysModal: () => void;
  onShowToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  onPrint,
  onClearSelectedDays,
  onOpenHolidaysModal,
  onShowToast
}) => {
  const {
    year,
    setYear,
    palette,
    setPalette,
    fontFamily,
    setFontFamily,
    subtitle,
    setSubtitle,
    weekStart,
    setWeekStart,
    highlightWeekends,
    setHighlightWeekends,
    layout,
    setLayout,
    dayNumberSize,
    setDayNumberSize,
    dayTextSize,
    setDayTextSize,
    dayNumberPosition,
    setDayNumberPosition,
    dayNotePosition,
    setDayNotePosition,
    monthRange,
    setMonthRange,
    markedDays
  } = useCalendarStore();

  const selectedCount = Object.keys(markedDays).length;
  const hasHolidaysOrLabels = Object.values(markedDays).some(
    (d) => d.isHoliday || (d.label && d.label.trim() !== '')
  );
  const middlePositions: DayNumberPosition[] = ['middle-left', 'center', 'middle-right'];

  const [tempYear, setTempYear] = useState<string>(String(year));

  useEffect(() => {
    setTempYear(String(year));
  }, [year]);

  const handleYearCommit = () => {
    const validYear = Math.min(2100, Math.max(1900, parseInt(tempYear, 10) || new Date().getFullYear()));
    setYear(validYear);
    setTempYear(String(validYear));
  };

  return (
    <header className="no-print bg-base-100 border-b border-base-300 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-base-content leading-tight">
                Calendario {year} Minimalista
              </h1>
              <p className="text-xs text-base-content/70 font-medium">
                Formato A4 Horizontal · Imprimible & Exportable
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="btn-open-holidays-modal"
              onClick={onOpenHolidaysModal}
              className="btn btn-sm btn-outline btn-primary gap-1.5"
              title="Buscar y cargar festivos oficiales desde API externa"
            >
              <Globe2 className="w-4 h-4" />
              <span>Festivos Oficiales (API)</span>
            </button>

            <button
              type="button"
              id="btn-clear-all-days"
              onClick={onClearSelectedDays}
              disabled={selectedCount === 0}
              className="btn btn-sm btn-outline btn-error gap-1.5"
              title={
                selectedCount > 0
                  ? `Desmarcar todos los días marcados (${selectedCount})`
                  : 'No hay ningún día marcado actualmente'
              }
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Desmarcar todos</span>
              {selectedCount > 0 && (
                <span className="badge badge-sm badge-error text-white font-mono text-[10px] font-bold">
                  {selectedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              id="btn-print-browser"
              onClick={onPrint}
              className="btn btn-sm btn-primary gap-1.5 text-white shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-3 border-t border-base-300 text-xs">
          {/* Grupo 1: Diseño General */}
          <div className="flex-1 min-w-[280px] bg-base-200/20 p-3 rounded-lg border border-base-300/50 flex flex-col gap-2.5">
            <div className="font-bold text-base-content/65 uppercase tracking-wider text-[10px] flex items-center gap-1.5 select-none">
              <Palette className="w-3.5 h-3.5 text-base-content/50" />
              <span>Diseño General</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-base-content/85">Paleta de colores</label>
                <select
                  id="select-palette"
                  value={palette}
                  onChange={(e) => setPalette(e.target.value as PaletteKey)}
                  className="select select-bordered select-sm w-full font-medium"
                >
                  <option value="gris">Gris Minimalista</option>
                  <option value="monocromo">Monocromo / Negro</option>
                  <option value="azul">Azul Ejecutivo</option>
                  <option value="oliva">Verde Oliva</option>
                  <option value="terracota">Terracota</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-base-content/85">Tipografía</label>
                <select
                  id="select-font"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as FontFamilyKey)}
                  className="select select-bordered select-sm w-full font-medium"
                >
                  <option value="jakarta">Plus Jakarta Sans</option>
                  <option value="inter">Inter</option>
                  <option value="playfair">Playfair Display</option>
                  <option value="roboto">Roboto</option>
                  <option value="lora">Lora</option>
                  <option value="fira">Fira Code</option>
                  <option value="jetbrains">JetBrains Mono</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="font-semibold text-base-content/85">Formato / Layout</label>
                <select
                  id="select-layout"
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as LayoutType)}
                  className="select select-bordered select-sm w-full font-medium"
                >
                  <option value="anual">Anual (12 meses)</option>
                  <option value="semestral">Semestral (6 meses)</option>
                  <option value="trimestral">Trimestral (3 meses)</option>
                  <option value="mensual">Mensual (1 mes)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grupo 2: Contenido y Rango */}
          <div className="flex-1 min-w-[280px] bg-base-200/20 p-3 rounded-lg border border-base-300/50 flex flex-col gap-2.5">
            <div className="font-bold text-base-content/65 uppercase tracking-wider text-[10px] flex items-center gap-1.5 select-none">
              <CalendarDays className="w-3.5 h-3.5 text-base-content/50" />
              <span>Contenido y Periodo</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-base-content/85">Año</label>
                  {year !== new Date().getFullYear() && (
                    <button
                      type="button"
                      id="btn-reset-year"
                      onClick={() => setYear(new Date().getFullYear())}
                      className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
                      title={`Restablecer al año actual (${new Date().getFullYear()})`}
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Hoy ({new Date().getFullYear()})
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setYear(Math.max(1900, year - 1))}
                    disabled={year <= 1900}
                    className="btn btn-sm btn-square btn-bordered text-xs font-bold"
                    title="Año anterior"
                    aria-label="Año anterior"
                  >
                    ‹
                  </button>
                  <input
                    id="input-year"
                    type="number"
                    min={1900}
                    max={2100}
                    value={tempYear}
                    onChange={(e) => setTempYear(e.target.value)}
                    onBlur={handleYearCommit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleYearCommit();
                      }
                    }}
                    className="input input-bordered input-sm w-full text-center !px-1 font-bold text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setYear(Math.min(2100, year + 1))}
                    disabled={year >= 2100}
                    className="btn btn-sm btn-square btn-bordered text-xs font-bold"
                    title="Año siguiente"
                    aria-label="Año siguiente"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-base-content/85">Subtítulo opcional</label>
                <input
                  id="input-subtitle"
                  type="text"
                  placeholder={`Ej: ${year} · Planificador anual`}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  maxLength={45}
                  className="input input-bordered input-sm w-full font-medium"
                />
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="font-semibold text-base-content/85">Rango de meses</label>
                <div className="flex gap-1.5 items-center w-full">
                  <select
                    id="select-range-start"
                    value={monthRange.start}
                    onChange={(e) => {
                      const start = parseInt(e.target.value);
                      const end = monthRange.end < start ? start : monthRange.end;
                      setMonthRange({ start, end });
                    }}
                    className="select select-bordered select-sm flex-1 font-medium min-w-0 text-xs"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i + 1} value={i + 1}>{name}</option>
                    ))}
                  </select>
                  <span className="text-base-content/50 font-bold shrink-0">a</span>
                  <select
                    id="select-range-end"
                    value={monthRange.end}
                    onChange={(e) => {
                      const end = parseInt(e.target.value);
                      const start = monthRange.start > end ? end : monthRange.start;
                      setMonthRange({ start, end });
                    }}
                    className="select select-bordered select-sm flex-1 font-medium min-w-0 text-xs"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i + 1} value={i + 1}>{name}</option>
                    ))}
                  </select>
                  <div className="dropdown dropdown-end shrink-0">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-sm btn-ghost btn-circle"
                      title="Accesos rápidos de meses"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box border border-base-300 w-36 text-xs mt-1"
                    >
                      <li>
                        <button type="button" onClick={() => setMonthRange({ start: 1, end: 12 })}>
                          Todo el año
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            const currentMonth = new Date().getMonth() + 1;
                            setMonthRange({ start: currentMonth, end: currentMonth });
                          }}
                        >
                          Mes actual
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grupo 3: Personalización del Día */}
          <div className="flex-1 min-w-[280px] bg-base-200/20 p-3 rounded-lg border border-base-300/50 flex flex-col gap-2.5">
            <div className="font-bold text-base-content/65 uppercase tracking-wider text-[10px] flex items-center gap-1.5 select-none">
              <SlidersHorizontal className="w-3.5 h-3.5 text-base-content/50" />
              <span>Ajustes del Día y Semana</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-1">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-base-content/85">Tamaño de número</label>
                <select
                  id="select-day-size"
                  value={dayNumberSize}
                  onChange={(e) => setDayNumberSize(e.target.value as DayNumberSize)}
                  className="select select-bordered select-sm w-full font-medium"
                >
                  <option value="sm">Pequeño</option>
                  <option value="md">Normal</option>
                  <option value="lg">Grande</option>
                  <option value="xl">Extra Grande</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-base-content/85">Tamaño de notas</label>
                <select
                  id="select-day-text-size"
                  value={dayTextSize}
                  onChange={(e) => setDayTextSize(e.target.value as DayTextSize)}
                  className="select select-bordered select-sm w-full font-medium"
                >
                  <option value="sm">Pequeño</option>
                  <option value="md">Normal</option>
                  <option value="lg">Grande</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-base-content/85">Alineación número</label>
                <DayPositionPicker
                  pickerType="number"
                  value={dayNumberPosition}
                  onChange={setDayNumberPosition}
                  title="Posición número (3×3)"
                  onShowToast={onShowToast}
                  disabledPositions={hasHolidaysOrLabels ? middlePositions : []}
                  disabledMessage="Esta posición está bloqueada por días festivos"
                  oppositeElementPosition={dayNotePosition}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-base-content/85">Alineación nota</label>
                <DayPositionPicker
                  pickerType="note"
                  value={dayNotePosition}
                  onChange={setDayNotePosition}
                  title="Posición nota (3×3)"
                  onShowToast={onShowToast}
                  disabledPositions={[dayNumberPosition, ...(hasHolidaysOrLabels ? middlePositions : [])]}
                  disabledMessage="Esta posición está ocupada por el número o bloqueada por días festivos"
                  oppositeElementPosition={dayNumberPosition}
                />
              </div>

              <div className="flex flex-col justify-center gap-0.5 pt-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-base-content/80 flex items-center gap-1 text-[11px]">
                    Semana inicia:
                    <span className="badge badge-sm badge-neutral font-mono text-[9px] font-semibold">
                      {weekStart === 'monday' ? 'Lun' : 'Dom'}
                    </span>
                  </span>
                  <input
                    id="toggle-week-start"
                    type="checkbox"
                    checked={weekStart === 'sunday'}
                    onChange={(e) => setWeekStart(e.target.checked ? 'sunday' : 'monday')}
                    className="toggle toggle-sm toggle-primary"
                  />
                </label>
              </div>

              <div className="flex flex-col justify-center gap-0.5 pt-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-base-content/80 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Fines de semana
                  </span>
                  <input
                    id="toggle-highlight-weekends"
                    type="checkbox"
                    checked={highlightWeekends}
                    onChange={(e) => setHighlightWeekends(e.target.checked)}
                    className="toggle toggle-sm toggle-primary"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
