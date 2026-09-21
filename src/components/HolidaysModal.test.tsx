import { act } from 'react';
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
  it('cierra con Escape cuando está abierto', async () => {
    const onClose = vi.fn();
    render(
      <HolidaysModal
        isOpen
        year={2027}
        onClose={onClose}
        onApplyHolidays={vi.fn()}
      />,
    );

    await screen.findByRole('dialog');
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignora Escape cuando está cerrado', async () => {
    const onClose = vi.fn();
    render(
      <HolidaysModal
        isOpen={false}
        year={2027}
        onClose={onClose}
        onApplyHolidays={vi.fn()}
      />,
    );

    await act(async () => {});
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ajusta el país seleccionado al filtrar por búsqueda', async () => {
    render(
      <HolidaysModal
        isOpen
        year={2027}
        onClose={vi.fn()}
        onApplyHolidays={vi.fn()}
      />,
    );

    await screen.findByRole('option', { name: 'España (ES)' });

    fireEvent.change(screen.getByPlaceholderText(/Buscar país/i), {
      target: { value: 'mex' },
    });

    await screen.findByDisplayValue('México (MX)');
  });

  it('recarga los festivos del primer país filtrado al cambiar la búsqueda', async () => {
    render(
      <HolidaysModal
        isOpen
        year={2027}
        onClose={vi.fn()}
        onApplyHolidays={vi.fn()}
      />,
    );

    await screen.findByRole('option', { name: 'España (ES)' });

    fireEvent.change(screen.getByPlaceholderText(/Buscar país/i), {
      target: { value: 'mex' },
    });

    await act(async () => {});

    const urls = mockFetch.mock.calls.map((call) => String(call[0]));
    expect(urls.some((url) => url.endsWith('/2027/MX'))).toBe(true);
  });
});
