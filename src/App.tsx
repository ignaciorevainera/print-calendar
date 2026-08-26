import React, { useState, useMemo } from 'react';
import { MarkedDaysMap } from './types';
import { useCalendarStore } from './store/useCalendarStore';
import { generateYearData } from './utils/calendarHelper';
import { ControlToolbar } from './components/ControlToolbar';
import { CalendarCanvas } from './components/CalendarCanvas';
import { DayColorModal } from './components/DayColorModal';
import { HolidaysModal } from './components/HolidaysModal';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const {
    year,
    weekStart,
    markedDays,
    setMarkedDays,
    monthRange
  } = useCalendarStore();

  const [isHolidaysModalOpen, setIsHolidaysModalOpen] = useState<boolean>(false);
  const [activeDayModal, setActiveDayModal] = useState<{
    dayKey: string;
    dayNumber: number;
    monthName: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const monthsData = useMemo(() => {
    return generateYearData(year, weekStart);
  }, [year, weekStart]);

  const visibleMonthsData = useMemo(() => {
    return monthsData.filter((m) => {
      const monthNum = m.monthIndex + 1;
      return monthNum >= monthRange.start && monthNum <= monthRange.end;
    });
  }, [monthsData, monthRange.start, monthRange.end]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 4500);
  };

  const handleOpenDayModal = (dayKey: string, dayNumber: number, monthName: string) => {
    setActiveDayModal({ dayKey, dayNumber, monthName });
  };

  const handleConfirmMarkDay = (color: string, label?: string, note?: string) => {
    if (!activeDayModal) return;
    const { dayKey, dayNumber, monthName } = activeDayModal;
    
    setMarkedDays((prev) => ({
      ...prev,
      [dayKey]: { 
        color,
        label: label !== undefined ? label : prev[dayKey]?.label,
        note: note !== undefined ? note : prev[dayKey]?.note,
        isHoliday: prev[dayKey]?.isHoliday
      }
    }));
    
    showToast(`Día ${dayNumber} de ${monthName} guardado`, 'success');
    setActiveDayModal(null);
  };

  const handleRemoveMarkDay = () => {
    if (!activeDayModal) return;
    const { dayKey, dayNumber } = activeDayModal;
    
    setMarkedDays((prev) => {
      const next = { ...prev };
      delete next[dayKey];
      return next;
    });

    showToast(`Marca del día ${dayNumber} eliminada`, 'info');
    setActiveDayModal(null);
  };

  const handleClearSelectedDays = () => {
    setMarkedDays({});
    showToast('Todas las fechas marcadas han sido eliminadas', 'info');
  };

  const handleApplyHolidays = (
    holidaysMap: MarkedDaysMap, 
    append: boolean, 
    countryLabel: string, 
    count: number
  ) => {
    setMarkedDays((prev) => {
      if (append) {
        return { ...prev, ...holidaysMap };
      }
      return holidaysMap;
    });

    showToast(`Se han cargado ${count} festivos de ${countryLabel} en el calendario`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 selection:bg-blue-100">
      <ControlToolbar
        onPrint={handlePrint}
        onClearSelectedDays={handleClearSelectedDays}
        onOpenHolidaysModal={() => setIsHolidaysModalOpen(true)}
      />

      {/* Área Principal de Visualización del Calendario */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 print:p-0">
        <CalendarCanvas
          months={visibleMonthsData}
          onSelectDay={handleOpenDayModal}
        />

        {/* Guía rápida inferior (no-print) */}
        <footer className="no-print w-full max-w-[1120px] pb-6 pt-2 px-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Haz clic en cualquier día para elegir su color o usa «Festivos Oficiales (API)» para cargar festivos nacionales y autonómicos.</span>
          </div>
          <div>
            <span>Diseñado para hoja A4 horizontal (297 × 210 mm) · Año {year}</span>
          </div>
        </footer>
      </main>

      {/* Modal para cargar festivos desde API externa */}
      <HolidaysModal
        isOpen={isHolidaysModalOpen}
        year={year}
        onClose={() => setIsHolidaysModalOpen(false)}
        onApplyHolidays={handleApplyHolidays}
      />

      {/* Modal para elegir color del día antes de confirmar */}
      {activeDayModal && (
        <DayColorModal
          isOpen={Boolean(activeDayModal)}
          dayNumber={activeDayModal.dayNumber}
          monthName={activeDayModal.monthName}
          year={year}
          currentMark={markedDays[activeDayModal.dayKey]}
          onConfirm={handleConfirmMarkDay}
          onRemove={handleRemoveMarkDay}
          onClose={() => setActiveDayModal(null)}
        />
      )}

      {/* Toast Notification with DaisyUI toast + alert */}
      {toastMessage && (
        <div className="toast toast-center toast-bottom z-50 no-print">
          <div
            className={`alert text-xs font-semibold py-2 px-4 shadow-xl border ${
              toastMessage.type === 'success'
                ? 'alert-success text-white'
                : toastMessage.type === 'error'
                ? 'alert-error text-white'
                : 'alert-neutral text-white'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
