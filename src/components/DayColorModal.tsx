import React, { useState, useEffect } from 'react';
import { Check, Trash2, X, Palette } from 'lucide-react';
import { MarkedDayInfo } from '../types';

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
  onConfirm: (color: string, label?: string, note?: string) => void;
  onRemove?: () => void;
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
  onClose
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    currentMark?.color || PRESET_COLORS[0].hex
  );
  const [dayLabel, setDayLabel] = useState<string>(currentMark?.label || '');
  const [dayNote, setDayNote] = useState<string>(currentMark?.note || '');

  // Sync color & label when modal opens or target day changes
  useEffect(() => {
    if (isOpen) {
      setSelectedColor(currentMark?.color || PRESET_COLORS[0].hex);
      setDayLabel(currentMark?.label || '');
      setDayNote(currentMark?.note || '');
    }
  }, [isOpen, currentMark]);

  // Handle ESC key to close and Enter to confirm
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else {
        const isTextarea = (e.target as HTMLElement)?.tagName === 'TEXTAREA';
        if (e.key === 'Enter' && !e.shiftKey && !isTextarea) {
          e.preventDefault();
          onConfirm(selectedColor, dayLabel.trim(), dayNote.trim());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedColor, dayLabel, dayNote, onConfirm, onClose]);

  if (!isOpen) return null;

  const isAlreadyMarked = Boolean(currentMark);

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
        className="modal-box max-w-sm p-5 space-y-4 bg-base-100 text-base-content border border-base-300 shadow-2xl modal-box-animate-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-day-title"
      >
        {/* Header */}
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

        {/* Live Preview Box */}
        <div className="flex items-center justify-between bg-base-200/70 p-3 rounded-lg border border-base-300">
          <div className="text-xs">
            <p className="font-semibold text-base-content">Vista previa en calendario</p>
            <p className="text-[11px] text-base-content/70">
              Color: <span className="font-mono font-bold">{selectedColor.toUpperCase()}</span>
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-base-100 transition-colors"
            style={{ backgroundColor: selectedColor }}
          >
            {dayNumber}
          </div>
        </div>

        {/* Preset Colors Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-base-content/80 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span>Colores recomendados</span>
          </label>
          <div className="grid grid-cols-5 gap-2 pt-0.5">
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
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color & Optional Note/Label */}
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

        {/* Action Buttons */}
        <div className="pt-2 border-t border-base-300 flex items-center justify-between gap-2">
          {isAlreadyMarked && onRemove ? (
            <button
              type="button"
              id="btn-remove-mark"
              onClick={onRemove}
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
              onClick={() => onConfirm(selectedColor, dayLabel.trim(), dayNote.trim())}
              className="btn btn-sm btn-primary gap-1.5 text-white"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
