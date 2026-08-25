import React from 'react';
import { PaletteKey, WeekStart, FontFamilyKey } from '../types';
import { 
  Download, 
  Printer, 
  Palette, 
  CalendarDays, 
  Type, 
  Sparkles, 
  Eraser, 
  Globe2, 
  SlidersHorizontal 
} from 'lucide-react';

interface ControlToolbarProps {
  palette: PaletteKey;
  onPaletteChange: (p: PaletteKey) => void;
  fontFamily: FontFamilyKey;
  onFontFamilyChange: (f: FontFamilyKey) => void;
  weekStart: WeekStart;
  onWeekStartChange: (w: WeekStart) => void;
  highlightWeekends: boolean;
  onToggleHighlightWeekends: () => void;
  subtitle: string;
  onSubtitleChange: (s: string) => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExporting: boolean;
  selectedCount: number;
  onClearSelectedDays: () => void;
  onOpenHolidaysModal: () => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  palette,
  onPaletteChange,
  fontFamily,
  onFontFamilyChange,
  weekStart,
  onWeekStartChange,
  highlightWeekends,
  onToggleHighlightWeekends,
  subtitle,
  onSubtitleChange,
  onExportPdf,
  onPrint,
  isExporting,
  selectedCount,
  onClearSelectedDays,
  onOpenHolidaysModal
}) => {
  return (
    <header className="no-print bg-base-100 border-b border-base-300 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top line with branding & primary action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-base-content leading-tight">
                Calendario 2027 Minimalista
              </h1>
              <p className="text-xs text-base-content/70 font-medium">
                Formato A4 Horizontal · Imprimible & Exportable
              </p>
            </div>
          </div>

          {/* Action Buttons using DaisyUI classes */}
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
              className="btn btn-sm btn-outline gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>

            <button
              type="button"
              id="btn-export-pdf"
              onClick={onExportPdf}
              disabled={isExporting}
              className="btn btn-sm btn-primary gap-1.5 text-white"
            >
              {isExporting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Descargar PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* Configuration Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-base-300 text-xs">
          {/* 1. Selector de Paleta de Colores */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 font-semibold text-base-content/80">
              <Palette className="w-3.5 h-3.5 text-base-content/60" />
              <span>Paleta de colores</span>
            </label>
            <select
              id="select-palette"
              value={palette}
              onChange={(e) => onPaletteChange(e.target.value as PaletteKey)}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="gris">Gris Minimalista</option>
              <option value="monocromo">Monocromo / Negro</option>
              <option value="azul">Azul Ejecutivo</option>
              <option value="oliva">Verde Oliva</option>
              <option value="terracota">Terracota</option>
            </select>
          </div>

          {/* 2. Selector de Tipografía */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 font-semibold text-base-content/80">
              <Type className="w-3.5 h-3.5 text-base-content/60" />
              <span>Tipografía</span>
            </label>
            <select
              id="select-font"
              value={fontFamily}
              onChange={(e) => onFontFamilyChange(e.target.value as FontFamilyKey)}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="jakarta">Plus Jakarta Sans (Moderna)</option>
              <option value="inter">Inter (Clásica limpia)</option>
              <option value="playfair">Playfair Display (Editorial Serif)</option>
            </select>
          </div>

          {/* 3. Subtítulo personalizado */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 font-semibold text-base-content/80">
              <SlidersHorizontal className="w-3.5 h-3.5 text-base-content/60" />
              <span>Subtítulo opcional</span>
            </label>
            <input
              id="input-subtitle"
              type="text"
              placeholder="Ej: 2027 · Planificador anual"
              value={subtitle}
              onChange={(e) => onSubtitleChange(e.target.value)}
              maxLength={45}
              className="input input-bordered input-sm w-full"
            />
          </div>

          {/* 4. Inicio de semana toggle */}
          <div className="flex flex-col justify-center gap-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-base-content/80 flex items-center gap-1">
                Inicio:
                <span className="badge badge-sm badge-neutral font-mono text-[10px] font-semibold">
                  {weekStart === 'monday' ? 'Lunes' : 'Domingo'}
                </span>
              </span>
              <input
                id="toggle-week-start"
                type="checkbox"
                checked={weekStart === 'sunday'}
                onChange={(e) => onWeekStartChange(e.target.checked ? 'sunday' : 'monday')}
                className="toggle toggle-sm toggle-primary"
              />
            </label>
            <span className="text-[11px] text-base-content/60 font-medium">
              {weekStart === 'monday' ? 'Semana estándar (L-D)' : 'Semana dominical (D-S)'}
            </span>
          </div>

          {/* 5. Resaltar fines de semana toggle */}
          <div className="flex flex-col justify-center gap-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-base-content/80 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Fines de semana
              </span>
              <input
                id="toggle-highlight-weekends"
                type="checkbox"
                checked={highlightWeekends}
                onChange={onToggleHighlightWeekends}
                className="toggle toggle-sm toggle-primary"
              />
            </label>
            <span className="text-[11px] text-base-content/60 font-medium">
              {highlightWeekends ? 'Sáb/Dom destacados' : 'Estilo neutro continuo'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
