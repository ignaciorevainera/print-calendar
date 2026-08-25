import React, { useState, useMemo } from 'react';
import { PaletteKey, WeekStart, FontFamilyKey, MarkedDaysMap } from './types';
import { generateYearData } from './utils/calendarHelper';
import { ControlToolbar } from './components/ControlToolbar';
import { CalendarCanvas } from './components/CalendarCanvas';
import { DayColorModal } from './components/DayColorModal';
import { HolidaysModal } from './components/HolidaysModal';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function App() {
  const [palette, setPalette] = useState<PaletteKey>('gris');
  const [fontFamily, setFontFamily] = useState<FontFamilyKey>('jakarta');
  const [weekStart, setWeekStart] = useState<WeekStart>('monday');
  const [highlightWeekends, setHighlightWeekends] = useState<boolean>(true);
  const [subtitle, setSubtitle] = useState<string>('');
  const [markedDays, setMarkedDays] = useState<MarkedDaysMap>({});
  const [isHolidaysModalOpen, setIsHolidaysModalOpen] = useState<boolean>(false);
  const [activeDayModal, setActiveDayModal] = useState<{
    dayKey: string;
    dayNumber: number;
    monthName: string;
  } | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Generate 2027 calendar year data dynamically
  const monthsData = useMemo(() => {
    return generateYearData(2027, weekStart);
  }, [weekStart]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 4500);
  };

  const handleOpenDayModal = (dayKey: string, dayNumber: number, monthName: string) => {
    setActiveDayModal({ dayKey, dayNumber, monthName });
  };

  const handleConfirmMarkDay = (color: string, label?: string) => {
    if (!activeDayModal) return;
    const { dayKey, dayNumber, monthName } = activeDayModal;
    
    setMarkedDays((prev) => ({
      ...prev,
      [dayKey]: { 
        color,
        label: label || prev[dayKey]?.label
      }
    }));
    
    showToast(`Día ${dayNumber} de ${monthName} marcado`, 'success');
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

  const handleExportPdf = async () => {
    const element = document.getElementById('calendar-canvas');
    if (!element) {
      showToast('Error: No se encontró el lienzo del calendario', 'error');
      return;
    }

    setIsExporting(true);
    showToast('Generando PDF en formato A4 horizontal...', 'info');

    try {
      // Ensure web fonts are completely loaded before capturing canvas
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // Sanitize any modern CSS color functions (oklch, color-mix) in stylesheets within the cloned iframe
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((styleTag) => {
            if (styleTag.textContent) {
              styleTag.textContent = styleTag.textContent
                .replace(/oklch\([^)]+\)/gi, '#475569')
                .replace(/color-mix\([^)]+\)/gi, '#475569');
            }
          });

          // Lock cloned calendar canvas element to exact pixel A4 landscape dimensions (1120px x 792px)
          // This eliminates sub-pixel rounding errors that cause overlapping text in html2canvas
          const clonedCanvas = clonedDoc.getElementById('calendar-canvas');
          if (clonedCanvas) {
            clonedCanvas.style.width = '1120px';
            clonedCanvas.style.height = '792px';
            clonedCanvas.style.maxWidth = 'none';
            clonedCanvas.style.maxHeight = 'none';
            clonedCanvas.style.aspectRatio = 'auto';
            clonedCanvas.style.boxShadow = 'none';
            clonedCanvas.style.margin = '0';
            clonedCanvas.style.borderRadius = '0';
            clonedCanvas.style.border = 'none';
          }
        }
      });

      // Lossless PNG for pin-sharp typography without JPEG compression artifacts
      const imgData = canvas.toDataURL('image/png');

      // A4 Landscape: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 297;
      const pdfHeight = 210;
      const margin = 5; // 5mm margin
      const renderWidth = pdfWidth - margin * 2;
      const renderHeight = (canvas.height * renderWidth) / canvas.width;

      // Centrar verticalmente en la página A4
      const offsetY = Math.max(margin, (pdfHeight - renderHeight) / 2);

      pdf.addImage(imgData, 'PNG', margin, offsetY, renderWidth, renderHeight, undefined, 'FAST');
      pdf.save('Calendario_2027_A4_Horizontal.pdf');

      showToast('¡PDF descargado con éxito!', 'success');
    } catch (err) {
      console.error('Error exportando PDF:', err);
      showToast('No se pudo generar el archivo directo. Abriendo vista de impresión...', 'error');
      try {
        window.print();
      } catch (printErr) {
        console.error('Error en fallback de impresión:', printErr);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Impresión directa interceptada, descargando PDF como respaldo:', err);
      showToast('Impresión interceptada en navegador. Descargando como PDF...', 'info');
      handleExportPdf();
    }
  };

  const totalMarkedCount = Object.keys(markedDays).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 selection:bg-blue-100">
      {/* Barra de Controles Superior */}
      <ControlToolbar
        palette={palette}
        onPaletteChange={setPalette}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        weekStart={weekStart}
        onWeekStartChange={setWeekStart}
        highlightWeekends={highlightWeekends}
        onToggleHighlightWeekends={() => setHighlightWeekends((prev) => !prev)}
        subtitle={subtitle}
        onSubtitleChange={setSubtitle}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        isExporting={isExporting}
        selectedCount={totalMarkedCount}
        onClearSelectedDays={handleClearSelectedDays}
        onOpenHolidaysModal={() => setIsHolidaysModalOpen(true)}
      />

      {/* Área Principal de Visualización del Calendario */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 print:p-0">
        <CalendarCanvas
          months={monthsData}
          palette={palette}
          fontFamily={fontFamily}
          weekStart={weekStart}
          highlightWeekends={highlightWeekends}
          subtitle={subtitle}
          markedDays={markedDays}
          onSelectDay={handleOpenDayModal}
        />

        {/* Guía rápida inferior (no-print) */}
        <footer className="no-print w-full max-w-[1120px] pb-6 pt-2 px-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Haz clic en cualquier día para elegir su color o usa «Festivos Oficiales (API)» para cargar festivos nacionales y autonómicos.</span>
          </div>
          <div>
            <span>Diseñado para hoja A4 horizontal (297 × 210 mm) · Año 2027</span>
          </div>
        </footer>
      </main>

      {/* Modal para cargar festivos desde API externa */}
      <HolidaysModal
        isOpen={isHolidaysModalOpen}
        year={2027}
        onClose={() => setIsHolidaysModalOpen(false)}
        onApplyHolidays={handleApplyHolidays}
      />

      {/* Modal para elegir color del día antes de confirmar */}
      {activeDayModal && (
        <DayColorModal
          isOpen={Boolean(activeDayModal)}
          dayNumber={activeDayModal.dayNumber}
          monthName={activeDayModal.monthName}
          year={2027}
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
