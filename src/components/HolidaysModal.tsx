import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchAvailableCountries, 
  fetchHolidays, 
  parseHolidayDate, 
  formatSubdivisionName 
} from '../services/holidayApi';
import { AvailableCountry, HolidayItem, MarkedDaysMap } from '../types';
import { PRESET_COLORS } from './DayColorModal';
import { 
  Globe2, 
  CalendarCheck, 
  Search, 
  Check, 
  X, 
  MapPin, 
  Palette, 
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';

interface HolidaysModalProps {
  isOpen: boolean;
  year?: number;
  onClose: () => void;
  onApplyHolidays: (holidaysMap: MarkedDaysMap, append: boolean, countryName: string, count: number) => void;
}

export const HolidaysModal: React.FC<HolidaysModalProps> = ({
  isOpen,
  year = 2027,
  onClose,
  onApplyHolidays
}) => {
  // State
  const [countries, setCountries] = useState<AvailableCountry[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('ES');
  const [countrySearch, setCountrySearch] = useState<string>('');
  
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(false);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [rawHolidays, setRawHolidays] = useState<HolidayItem[]>([]);
  const [scopeFilter, setScopeFilter] = useState<'all' | 'national' | 'region'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  
  const [holidayColor, setHolidayColor] = useState<string>('#dc2626'); // Rojo carmesí por defecto para festivos
  const [appendMode, setAppendMode] = useState<boolean>(true);

  // Load countries on mount
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingCountries(true);
    fetchAvailableCountries()
      .then((data) => {
        if (isMounted) {
          setCountries(data);
          setIsLoadingCountries(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setIsLoadingCountries(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Load holidays when country or year changes
  useEffect(() => {
    if (!isOpen || !selectedCountryCode) return;

    let isMounted = true;
    setIsLoadingHolidays(true);
    setErrorMessage(null);

    fetchHolidays(year, selectedCountryCode)
      .then((data) => {
        if (isMounted) {
          setRawHolidays(data);
          setIsLoadingHolidays(false);
          // Reset region selection if current region is not in new country
          setSelectedRegion('');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(err.message || 'No se pudieron cargar los festivos para este país.');
          setRawHolidays([]);
          setIsLoadingHolidays(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedCountryCode, year]);

  // Extract available regions / subdivisions from holiday data
  const availableRegions = useMemo(() => {
    const regionSet = new Set<string>();
    rawHolidays.forEach((h) => {
      if (h.counties && Array.isArray(h.counties)) {
        h.counties.forEach((c) => regionSet.add(c));
      }
    });
    return Array.from(regionSet).sort((a, b) => 
      formatSubdivisionName(a).localeCompare(formatSubdivisionName(b), 'es')
    );
  }, [rawHolidays]);

  // Filtered countries based on search term
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const query = countrySearch.toLowerCase();
    return countries.filter(
      (c) =>
        (c.spanishName && c.spanishName.toLowerCase().includes(query)) ||
        c.name.toLowerCase().includes(query) ||
        c.countryCode.toLowerCase().includes(query)
    );
  }, [countries, countrySearch]);

  // Filtered holidays to be applied and previewed
  const displayedHolidays = useMemo(() => {
    return rawHolidays.filter((h) => {
      if (scopeFilter === 'national') {
        return h.global === true || !h.counties || h.counties.length === 0;
      }
      if (scopeFilter === 'region' && selectedRegion) {
        return (
          h.global === true ||
          (h.counties && h.counties.includes(selectedRegion))
        );
      }
      return true; // 'all'
    });
  }, [rawHolidays, scopeFilter, selectedRegion]);

  // Selected country display name
  const currentCountry = useMemo(() => {
    return countries.find((c) => c.countryCode === selectedCountryCode);
  }, [countries, selectedCountryCode]);

  // Format date helper (e.g. 2027-01-01 -> 1 de enero)
  const formatHolidayDate = (dateStr: string) => {
    const parsed = parseHolidayDate(dateStr);
    if (!parsed) return dateStr;
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parsed.day} de ${monthNames[parsed.monthIndex]}`;
  };

  // Confirm and Apply Holidays to main Calendar State
  const handleApply = () => {
    if (displayedHolidays.length === 0) return;

    const newMarksMap: MarkedDaysMap = {};

    displayedHolidays.forEach((h) => {
      const parsed = parseHolidayDate(h.date);
      if (parsed) {
        newMarksMap[parsed.dayKey] = {
          color: holidayColor,
          label: h.localName || h.name
        };
      }
    });

    const countryName = currentCountry?.spanishName || currentCountry?.name || selectedCountryCode;
    const regionName = selectedRegion ? ` (${formatSubdivisionName(selectedRegion)})` : '';
    const finalLabel = `${countryName}${regionName}`;

    onApplyHolidays(newMarksMap, appendMode, finalLabel, displayedHolidays.length);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="holidays-modal-backdrop"
      className="modal modal-open no-print"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="holidays-modal-card"
        className="modal-box max-w-2xl p-0 flex flex-col max-h-[90vh] overflow-hidden bg-base-100 text-base-content border border-base-300 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="holidays-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-base-300 bg-base-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="holidays-modal-title" className="text-base font-bold text-base-content leading-tight">
                Cargar Festivos Oficiales ({year})
              </h3>
              <p className="text-xs text-base-content/70 font-medium">
                Consulta y añade festivos nacionales y autonómicos desde API oficial
              </p>
            </div>
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Top Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Country Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-base-content/80 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>País</span>
              </label>
              <div className="space-y-1.5">
                {/* Search country */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar país (ej: España, México)..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="input input-bordered input-sm w-full pl-8 pr-7 text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-base-content/40 absolute left-2.5 top-2.5 pointer-events-none" />
                  {countrySearch && (
                    <button
                      type="button"
                      onClick={() => setCountrySearch('')}
                      className="absolute right-2 top-2 text-base-content/50 hover:text-base-content"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <select
                  id="select-country"
                  value={selectedCountryCode}
                  onChange={(e) => {
                    setSelectedCountryCode(e.target.value);
                    setScopeFilter('all');
                  }}
                  disabled={isLoadingCountries}
                  className="select select-bordered select-sm w-full text-xs font-semibold"
                >
                  {filteredCountries.map((c) => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {c.spanishName || c.name} ({c.countryCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scope / Region Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-base-content/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Ámbito de festivos</span>
              </label>
              <div className="space-y-1.5">
                <select
                  id="select-scope"
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value as 'all' | 'national' | 'region')}
                  className="select select-bordered select-sm w-full text-xs font-semibold"
                >
                  <option value="all">Todos (Nacionales y Regionales)</option>
                  <option value="national">Solo Festivos Nacionales</option>
                  {availableRegions.length > 0 && (
                    <option value="region">Filtrar por Región / Comunidad</option>
                  )}
                </select>

                {scopeFilter === 'region' && availableRegions.length > 0 && (
                  <select
                    id="select-region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="select select-bordered select-sm select-primary w-full text-xs font-semibold"
                  >
                    <option value="">-- Selecciona una región / autonomía --</option>
                    {availableRegions.map((reg) => (
                      <option key={reg} value={reg}>
                        {formatSubdivisionName(reg)} ({reg})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Color and Mode Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-base-300">
            {/* Color for holidays */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-base-content/80 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-primary" />
                <span>Color de los festivos</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_COLORS.slice(0, 6).map((c) => {
                    const isSelected = holidayColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={c.hex}
                        onClick={() => setHolidayColor(c.hex)}
                        title={c.name}
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-primary ring-offset-1 scale-110 shadow-xs' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="color"
                  value={holidayColor}
                  onChange={(e) => setHolidayColor(e.target.value)}
                  className="input input-bordered input-sm p-0.5 w-7 h-7 cursor-pointer ml-auto"
                  title="Color personalizado"
                />
              </div>
            </div>

            {/* Application Mode (Append or Replace) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-base-content/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Modo de asignación</span>
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="appendMode"
                    checked={appendMode}
                    onChange={() => setAppendMode(true)}
                    className="radio radio-sm radio-primary"
                  />
                  <span className="text-xs text-base-content/80 font-medium">Añadir a los actuales</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="appendMode"
                    checked={!appendMode}
                    onChange={() => setAppendMode(false)}
                    className="radio radio-sm radio-primary"
                  />
                  <span className="text-xs text-base-content/80 font-medium">Reemplazar anteriores</span>
                </label>
              </div>
            </div>
          </div>

          {/* Holidays Preview Section */}
          <div className="space-y-2 pt-3 border-t border-base-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-base-content flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-primary" />
                <span>Festivos encontrados ({displayedHolidays.length})</span>
              </span>
              {displayedHolidays.length > 0 && (
                <span className="badge badge-sm badge-ghost font-mono font-semibold">
                  {currentCountry?.spanishName || currentCountry?.name} · {year}
                </span>
              )}
            </div>

            {/* List container */}
            <div className="bg-base-200/50 rounded-xl border border-base-300 p-2 max-h-52 overflow-y-auto space-y-1.5 text-xs">
              {isLoadingHolidays ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-base-content/60">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                  <span>Consultando festivos oficiales...</span>
                </div>
              ) : errorMessage ? (
                <div className="py-6 px-4 flex items-center gap-2 text-error text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              ) : displayedHolidays.length === 0 ? (
                <div className="py-8 text-center text-base-content/40 font-medium">
                  No se encontraron festivos para el filtro seleccionado.
                </div>
              ) : (
                displayedHolidays.map((h, idx) => (
                  <div
                    key={`${h.date}-${h.localName}-${idx}`}
                    className="py-1.5 px-2.5 bg-base-100 border border-base-300 rounded-lg flex items-center justify-between shadow-xs transition-colors hover:border-base-content/20"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: holidayColor }}
                      />
                      <span className="font-bold text-base-content whitespace-nowrap">
                        {formatHolidayDate(h.date)}:
                      </span>
                      <span className="text-base-content/80 font-medium truncate" title={h.localName}>
                        {h.localName}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      {h.global ? (
                        <span className="badge badge-sm badge-neutral font-bold text-[10px]">
                          Nacional
                        </span>
                      ) : (
                        <span className="badge badge-sm badge-outline font-bold text-[10px]">
                          {h.counties && h.counties.length === 1
                            ? formatSubdivisionName(h.counties[0])
                            : 'Regional'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300 bg-base-200/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost"
          >
            Cancelar
          </button>

          <button
            type="button"
            id="btn-confirm-apply-holidays"
            onClick={handleApply}
            disabled={isLoadingHolidays || displayedHolidays.length === 0}
            className="btn btn-sm btn-primary gap-1.5 text-white"
          >
            <Check className="w-4 h-4" />
            <span>Cargar {displayedHolidays.length} festivos en el calendario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
