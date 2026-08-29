import React, { useState, useEffect } from 'react';
import { Check, Trash2, X, Palette, Repeat, AlertTriangle } from 'lucide-react';
import { MarkedDayInfo, RecurrencePattern, RecurrenceOptions } from '../types';
import { getContrastTextColor } from '../utils/colorHelper';
import { calculateRecurringDays } from '../utils/recurrenceHelper';
import { useCalendarStore } from '../store/useCalendarStore';
import { getMonthNames } from '../utils/i18n';

export const PRESET_COLORS = [
  { name: 'Azul Ejecutivo', hex: '#2563eb' },
  { name: 'Rojo Carmesí', hex: '#dc2626' },
  { name: 'Verde Esmeralda', hex: '#059669' },
  { name: 'Ámbar Cálido', hex: '#d97706' },
  { name: 'Púrpura Vibrante', hex: '#7c3aed' },
  { name: 'Rosa Vivo', hex: '#db2777' },
  { name: 'Turquesa', hex: '#0d9488' },
  { name: 'Terracota', hex: '#c2410c' },
  { name: 'Pizarra Oscuro', hex: '#334155' },
  { name: 'Negro Puro', hex: '#111827' }
];

interface DayColorModalProps {
  isOpen: boolean;
  dayNumber: number;
  monthName: string;
  year?: number;
  currentMark?: MarkedDayInfo;
  onConfirm: (color: string, label?: string, note?: string, recurrence?: RecurrenceOptions) => void;
  onRemove?: () => void;
  onRemoveSeries?: (seriesId: string) => void;
  onClose: () => void;
}

export const DayColorModal: React.FC<DayColorModalProps> = ({
  isOpen,
  dayNumber,
  monthName,
  year = 2027,
  currentMark,
  onConfirm,
  onRemove,
  onRemoveSeries,
  onClose
}) => {
  const locale = useCalendarStore((state) => state.locale);
  const markedDays = useCalendarStore((state) => state.markedDays);

  const [selectedColor, setSelectedColor] = useState<string>(
    currentMark?.color || PRESET_COLORS[0].hex
  );
  const [dayLabel, setDayLabel] = useState<string>(currentMark?.label || '');
  const [dayNote, setDayNote] = useState<string>(currentMark?.note || '');

  const [pattern, setPattern] = useState<RecurrencePattern>('none');
  const [endDate, setEndDate] = useState<string>(`${year}-12-31`);
  const [overwriteExisting, setOverwriteExisting] = useState<boolean>(true);
  const [confirmDeleteSeries, setConfirmDeleteSeries] = useState<boolean>(false);

  const monthNames = getMonthNames(locale);
  const rawMonthIndex = monthNames.indexOf(monthName);
  const monthIndex = rawMonthIndex !== -1 ? rawMonthIndex : 0;

  const targetDate = new Date(year, monthIndex, dayNumber);
  const weekdayName = targetDate.toLocaleDateString(locale, { weekday: 'long' });

  const affectedCount = calculateRecurringDays(
    year,
    monthIndex,
    dayNumber,
    { pattern, endDate, overwriteExisting },
    markedDays
  ).length;

  useEffect(() => {
    if (isOpen) {
      setSelectedColor(currentMark?.color || PRESET_COLORS[0].hex);
      setDayLabel(currentMark?.label || '');
      setDayNote(currentMark?.note || '');
      setPattern('none');
      setEndDate(`${year}-12-31`);
      setOverwriteExisting(true);
      setConfirmDeleteSeries(false);
    }
  }, [isOpen, currentMark, year]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmDeleteSeries) {
          setConfirmDeleteSeries(false);
        } else {
          onClose();
        }
      } else {
        const isTextarea = (e.target as HTMLElement)?.tagName === 'TEXTAREA';
        if (e.key === 'Enter' && !e.shiftKey && !isTextarea && !confirmDeleteSeries) {
          e.preventDefault();
          onConfirm(selectedColor, dayLabel.trim(), dayNote.trim(), {
            pattern,
            endDate,
            overwriteExisting
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    selectedColor,
    dayLabel,
    dayNote,
    pattern,
    endDate,
    overwriteExisting,
    confirmDeleteSeries,
    onConfirm,
    onClose
  ]);

  if (!isOpen) return null;

  const isAlreadyMarked = Boolean(currentMark);
  const previewTextColor = getContrastTextColor(selectedColor);

  return (
    <div
      id="day-color-modal-backdrop"
      className="modal modal-open no-print modal-animate-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="day-color-modal-card"
        className="modal-box w-[calc(100vw-1.5rem)] max-w-sm p-4 sm:p-5 space-y-4 bg-base-100 text-base-content border border-base-300 shadow-2xl modal-box-animate-in max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-day-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-base-300">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
              {isAlreadyMarked ? 'Modificar día marcado' : 'Elegir color del día'}
            </span>
            <h3 id="modal-day-title" className="text-base font-bold text-base-content leading-tight">
              {dayNumber} de {monthName}, {year}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost btn-circle"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmDeleteSeries ? (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-sm text-base-content mb-1">Serie de marcadores</p>
                <p className="text-base-content/80">
                  Este día forma parte de una serie de marcadores. ¿Qué deseas hacer?
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                id="btn-remove-single-day"
                onClick={() => {
                  setConfirmDeleteSeries(false);
                  onRemove?.();
                }}
                className="btn btn-sm btn-outline btn-warning w-full"
              >
                Eliminar solo este día
              </button>
              <button
                type="button"
                id="btn-remove-entire-series"
                onClick={() => {
                  setConfirmDeleteSeries(false);
                  if (currentMark?.seriesId && onRemoveSeries) {
                    onRemoveSeries(currentMark.seriesId);
                  }
                }}
                className="btn btn-sm btn-error text-white w-full"
              >
                Eliminar serie completa
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteSeries(false)}
                className="btn btn-sm btn-ghost w-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between bg-base-200/70 p-3 rounded-lg border border-base-300">
              <div className="text-xs">
                <p className="font-semibold text-base-content">Vista previa en calendario</p>
                <p className="text-[11px] text-base-content/70">
                  Color: <span className="font-mono font-bold">{selectedColor.toUpperCase()}</span>
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-base-100 transition-colors"
                style={{ backgroundColor: selectedColor, color: previewTextColor }}
              >
                {dayNumber}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-base-content/80 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-primary" />
                <span>Colores recomendados</span>
              </label>
              <div className="grid grid-cols-5 gap-1 sm:gap-2 pt-0.5">
                {PRESET_COLORS.map((c) => {
                  const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={c.hex}
                      id={`btn-color-preset-${c.hex.replace('#', '')}`}
                      onClick={() => setSelectedColor(c.hex)}
                      title={`${c.name} (${c.hex})`}
                      className={`h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-sm' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check className="w-4 h-4" style={{ color: getContrastTextColor(c.hex) }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-base-300 text-xs">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="custom-hex-color" className="font-bold text-base-content/80">
                  Color personalizado:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="custom-hex-color"
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="input input-bordered input-sm p-0.5 w-9 h-9 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-semibold">{selectedColor.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="input-day-label" className="font-bold text-base-content/80 block">
                  Etiqueta o motivo (opcional):
                </label>
                <input
                  id="input-day-label"
                  type="text"
                  placeholder="Ej: Cumpleaños, Reunión, Vacaciones..."
                  value={dayLabel}
                  onChange={(e) => setDayLabel(e.target.value)}
                  maxLength={30}
                  className="input input-bordered input-sm w-full"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="input-day-note" className="font-bold text-base-content/80 block">
                  Nota o texto descriptivo (opcional):
                </label>
                <textarea
                  id="input-day-note"
                  rows={3}
                  placeholder="Escribe detalles, horarios, recordatorios..."
                  value={dayNote}
                  onChange={(e) => setDayNote(e.target.value)}
                  maxLength={250}
                  className="textarea textarea-bordered textarea-sm w-full text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-base-300 text-xs">
              <div className="space-y-1">
                <label htmlFor="select-recurrence-pattern" className="font-bold text-base-content/80 flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5 text-primary" />
                  <span>Repetir marcador</span>
                </label>
                <select
                  id="select-recurrence-pattern"
                  className="select select-bordered select-sm w-full text-xs"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value as RecurrencePattern)}
                >
                  <option value="none">Solo este día</option>
                  <option value="weekday_month">Todos los {weekdayName} de {monthNames[monthIndex]}</option>
                  <option value="weekday_year">Todos los {weekdayName} del año</option>
                  <option value="day_of_month">El día {dayNumber} de cada mes</option>
                  <option value="custom_range">Personalizado con fecha fin</option>
                </select>
              </div>

              {pattern === 'custom_range' && (
                <div className="space-y-1">
                  <label htmlFor="input-recurrence-end-date" className="font-bold text-base-content/80 block">
                    Fecha fin:
                  </label>
                  <input
                    id="input-recurrence-end-date"
                    type="date"
                    className="input input-bordered input-sm w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={`${year}-01-01`}
                    max={`${year}-12-31`}
                  />
                </div>
              )}

              {pattern !== 'none' && (
                <div className="space-y-2 pt-1">
                  <label className="flex items-center justify-between cursor-pointer gap-2">
                    <span className="font-medium text-base-content/80">Sobrescribir días marcados</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-primary"
                      checked={overwriteExisting}
                      onChange={(e) => setOverwriteExisting(e.target.checked)}
                    />
                  </label>
                  <p className="text-[11px] text-base-content/70 font-medium">
                    Se aplicará a {affectedCount} días
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-base-300 flex items-center justify-between gap-2">
              {isAlreadyMarked && onRemove ? (
                <button
                  type="button"
                  id="btn-remove-mark"
                  onClick={() => {
                    if (currentMark?.seriesId) {
                      setConfirmDeleteSeries(true);
                    } else {
                      onRemove();
                    }
                  }}
                  className="btn btn-sm btn-outline btn-error gap-1.5"
                  title="Desmarcar este día"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Desmarcar</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost"
                >
                  Cancelar
                </button>
              )}

              <div className="flex items-center gap-2">
                {isAlreadyMarked && onRemove && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-ghost"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="button"
                  id="btn-confirm-mark-color"
                  onClick={() =>
                    onConfirm(selectedColor, dayLabel.trim(), dayNote.trim(), {
                      pattern,
                      endDate,
                      overwriteExisting
                    })
                  }
                  className="btn btn-sm btn-primary gap-1.5 text-white"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
