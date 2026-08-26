import React from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import { DayNumberPosition } from '../types';
import { LayoutGrid } from 'lucide-react';

const POSITIONS: { id: DayNumberPosition; label: string }[][] = [
  [
    { id: 'top-left', label: '↖ Superior Izquierda' },
    { id: 'top-center', label: '↑ Superior Centro' },
    { id: 'top-right', label: '↗ Superior Derecha' },
  ],
  [
    { id: 'middle-left', label: '← Centro Izquierda' },
    { id: 'center', label: '• Centro' },
    { id: 'middle-right', label: '→ Centro Derecha' },
  ],
  [
    { id: 'bottom-left', label: '↙ Inferior Izquierda' },
    { id: 'bottom-center', label: '↓ Inferior Centro' },
    { id: 'bottom-right', label: '↘ Inferior Derecha' },
  ],
];

export const DayPositionPicker: React.FC = () => {
  const { dayNumberPosition, setDayNumberPosition } = useCalendarStore();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-sm btn-outline border-base-300 w-full justify-between gap-1.5 font-medium"
      >
        <span className="flex items-center gap-1.5 truncate">
          <LayoutGrid className="w-3.5 h-3.5 text-base-content/60" />
          <span className="capitalize">{dayNumberPosition.replace('-', ' ')}</span>
        </span>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-50 p-3 shadow-xl bg-base-100 rounded-box border border-base-300 w-44 mt-1"
      >
        <div className="text-[11px] font-bold text-base-content/70 mb-2 uppercase tracking-wider text-center">
          Posición (3×3)
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-base-200 rounded-lg">
          {POSITIONS.flat().map((pos) => {
            const isSelected = dayNumberPosition === pos.id;
            return (
              <button
                key={pos.id}
                type="button"
                onClick={() => setDayNumberPosition(pos.id)}
                title={pos.label}
                className={`h-9 rounded flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-content font-bold shadow-xs'
                    : 'bg-base-100 hover:bg-base-300 text-base-content/70'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSelected ? 'bg-primary-content' : 'bg-base-content/30'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
