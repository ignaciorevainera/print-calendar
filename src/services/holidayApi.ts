import { AvailableCountry, HolidayItem } from '../types';

// Spanish translations for country display
export const COUNTRY_SPANISH_NAMES: Record<string, string> = {
  ES: 'España',
  AR: 'Argentina',
  MX: 'México',
  CO: 'Colombia',
  CL: 'Chile',
  PE: 'Perú',
  UY: 'Uruguay',
  VE: 'Venezuela',
  EC: 'Ecuador',
  BO: 'Bolivia',
  PY: 'Paraguay',
  CR: 'Costa Rica',
  PA: 'Panamá',
  DO: 'República Dominicana',
  GT: 'Guatemala',
  HN: 'Honduras',
  SV: 'El Salvador',
  NI: 'Nicaragua',
  US: 'Estados Unidos',
  FR: 'Francia',
  IT: 'Italia',
  DE: 'Alemania',
  GB: 'Reino Unido',
  PT: 'Portugal',
  BR: 'Brasil',
  CA: 'Canadá',
  JP: 'Japón',
  AU: 'Australia',
  CH: 'Suiza',
  AT: 'Austria',
  BE: 'Bélgica',
  NL: 'Países Bajos',
  IE: 'Irlanda',
  SE: 'Suecia',
  NO: 'Noruega',
  DK: 'Dinamarca',
  FI: 'Finlandia',
  PL: 'Polonia'
};

// Common Spanish subdivisions mapping for clean labels
export const REGION_SPANISH_NAMES: Record<string, string> = {
  // España (Comunidades Autónomas)
  'ES-AN': 'Andalucía',
  'ES-AR': 'Aragón',
  'ES-AS': 'Asturias',
  'ES-CB': 'Cantabria',
  'ES-CL': 'Castilla y León',
  'ES-CM': 'Castilla-La Mancha',
  'ES-CT': 'Cataluña',
  'ES-EX': 'Extremadura',
  'ES-GA': 'Galicia',
  'ES-IB': 'Islas Baleares',
  'ES-CN': 'Canarias',
  'ES-RI': 'La Rioja',
  'ES-MD': 'Comunidad de Madrid',
  'ES-MC': 'Región de Murcia',
  'ES-NC': 'Navarra',
  'ES-PV': 'País Vasco',
  'ES-VC': 'Comunidad Valenciana',
  'ES-CE': 'Ceuta',
  'ES-ML': 'Melilla'
};

export const FALLBACK_COUNTRIES: AvailableCountry[] = [
  { countryCode: 'ES', name: 'Spain', spanishName: 'España' },
  { countryCode: 'AR', name: 'Argentina', spanishName: 'Argentina' },
  { countryCode: 'MX', name: 'Mexico', spanishName: 'México' },
  { countryCode: 'CO', name: 'Colombia', spanishName: 'Colombia' },
  { countryCode: 'CL', name: 'Chile', spanishName: 'Chile' },
  { countryCode: 'PE', name: 'Peru', spanishName: 'Perú' },
  { countryCode: 'UY', name: 'Uruguay', spanishName: 'Uruguay' },
  { countryCode: 'US', name: 'United States', spanishName: 'Estados Unidos' },
  { countryCode: 'FR', name: 'France', spanishName: 'Francia' },
  { countryCode: 'IT', name: 'Italy', spanishName: 'Italia' },
  { countryCode: 'DE', name: 'Germany', spanishName: 'Alemania' },
  { countryCode: 'GB', name: 'United Kingdom', spanishName: 'Reino Unido' },
  { countryCode: 'PT', name: 'Portugal', spanishName: 'Portugal' },
  { countryCode: 'BR', name: 'Brazil', spanishName: 'Brasil' },
  { countryCode: 'CA', name: 'Canada', spanishName: 'Canadá' }
];

/**
 * Fetches available countries from Nager.Date API with Spanish name resolution
 */
export async function fetchAvailableCountries(): Promise<AvailableCountry[]> {
  try {
    const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: { countryCode: string; name: string }[] = await response.json();
    
    return data.map((c) => ({
      countryCode: c.countryCode,
      name: c.name,
      spanishName: COUNTRY_SPANISH_NAMES[c.countryCode] || c.name
    })).sort((a, b) => (a.spanishName || a.name).localeCompare(b.spanishName || b.name, 'es'));
  } catch (err) {
    console.warn('Error cargando países desde API externa, usando lista predeterminada:', err);
    return FALLBACK_COUNTRIES;
  }
}

/**
 * Fetches public holidays for a given year and country code
 */
export async function fetchHolidays(year: number, countryCode: string): Promise<HolidayItem[]> {
  const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
  if (!response.ok) {
    throw new Error(`No se pudieron obtener los festivos para ${countryCode} en ${year}`);
  }
  const data: HolidayItem[] = await response.json();
  return data;
}

/**
 * Converts a holiday date 'YYYY-MM-DD' into monthIndex (0-11), day (1-31) and calendar dayKey 'M-D'
 */
export function parseHolidayDate(dateStr: string): { monthIndex: number; day: number; dayKey: string } {
  const parts = dateStr.split('-');
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dayKey = `${monthIndex + 1}-${day}`;
  return { monthIndex, day, dayKey };
}

/**
 * Formats a subdivision code into a user-friendly name
 */
export function formatSubdivisionName(code: string): string {
  if (REGION_SPANISH_NAMES[code]) {
    return REGION_SPANISH_NAMES[code];
  }
  const parts = code.split('-');
  return parts.length > 1 ? `${parts[1]} (${parts[0]})` : code;
}
