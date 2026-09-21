import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearHolidaysCache, fetchHolidays } from './holidayApi';

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
