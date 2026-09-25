import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FALLBACK_COUNTRIES,
  clearHolidaysCache,
  fetchAvailableCountries,
  fetchHolidays,
} from './holidayApi';

const mockFetch = vi.fn();

const mockHolidays = [
  {
    date: '2027-01-01',
    localName: 'Año Nuevo',
    name: "New Year's Day",
    countryCode: 'ES',
    global: true,
    counties: null,
  },
];

beforeEach(() => {
  clearHolidaysCache();
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({ ok: true, json: async () => mockHolidays });
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('fetchHolidays', () => {
  it('usa la caché en la segunda llamada con mismo año y país', async () => {
    const first = await fetchHolidays(2027, 'ES');
    const second = await fetchHolidays(2027, 'ES');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
  });

  it('pide a la red para otro país', async () => {
    await fetchHolidays(2027, 'ES');
    await fetchHolidays(2027, 'MX');

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

const mockCountries = [
  { countryCode: 'ES', name: 'Spain' },
  { countryCode: 'MX', name: 'Mexico' },
];

describe('fetchAvailableCountries', () => {
  it('usa la caché en la segunda llamada', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockCountries });

    const first = await fetchAvailableCountries();
    const second = await fetchAvailableCountries();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it('vuelve a pedir países tras limpiar la caché', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockCountries });

    await fetchAvailableCountries();
    clearHolidaysCache();
    await fetchAvailableCountries();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('devuelve la lista predeterminada si la API responde con error', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, json: async () => [] });

    const result = await fetchAvailableCountries();

    expect(result).toEqual(FALLBACK_COUNTRIES);
  });

  it('reintenta la lista predeterminada tras dos fallos', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, json: async () => [] });

    const first = await fetchAvailableCountries();
    const second = await fetchAvailableCountries();

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(first).toEqual(FALLBACK_COUNTRIES);
    expect(second).toEqual(FALLBACK_COUNTRIES);
  });

  it('aborta la petición tras 10 segundos y usa la lista predeterminada', async () => {
    vi.useFakeTimers();
    let receivedSignal: AbortSignal | undefined;
    mockFetch.mockImplementation(
      (_url: string, init?: RequestInit) => {
        receivedSignal = init?.signal;
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        });
      },
    );

    const promise = fetchAvailableCountries();
    await vi.advanceTimersByTimeAsync(9_999);
    expect(receivedSignal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(receivedSignal?.aborted).toBe(true);

    const result = await promise;

    expect(result).toEqual(FALLBACK_COUNTRIES);
  });
});
