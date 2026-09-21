import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HolidaysModal } from './HolidaysModal';

const mockFetch = vi.fn();

const mockCountries = [
  { countryCode: 'ES', name: 'Spain' },
  { countryCode: 'MX', name: 'Mexico' },
  { countryCode: 'US', name: 'United States' },
];

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockImplementation(async (url: string) => {
    if (url.includes('AvailableCountries')) {
      return { ok: true, json: async () => mockCountries };
    }
    return { ok: true, json: async () => [] };
  });
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HolidaysModal', () => {
  it('cierra con Escape cuando está abierto', () => {
    const onClose = vi.fn();
    render(
      <HolidaysModal
        isOpen
        year={2027}
        onClose={onClose}
        onApplyHolidays={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignora Escape cuando está cerrado', () => {
    const onClose = vi.fn();
    render(
      <HolidaysModal
        isOpen={false}
        year={2027}
        onClose={onClose}
        onApplyHolidays={vi.fn()}
      />,
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
