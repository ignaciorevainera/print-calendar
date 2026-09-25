import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HolidaysModal } from './HolidaysModal';
import { clearHolidaysCache } from '../services/holidayApi';

const mockFetch = vi.fn();

const mockCountries = [
  { countryCode: 'ES', name: 'Spain' },
  { countryCode: 'MX', name: 'Mexico' },
  { countryCode: 'US', name: 'United States' },
];

const malformedHoliday = {
  date: 'sin-fecha',
  localName: 'Fecha inválida',
  name: 'Invalid date',
  countryCode: 'ES',
  global: true,
  counties: null,
};

const validHoliday = {
  date: '2027-01-01',
  localName: 'Año Nuevo',
  name: "New Year's Day",
  countryCode: 'ES',
  global: true,
  counties: null,
};

beforeEach(() => {
  clearHolidaysCache();
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

  it('omite una lista de festivos entièrement malformada antes de previsualizarla y aplicarla', async () => {
    const onApplyHolidays = vi.fn();
    mockFetch.mockImplementation(async (url: string) => ({
      ok: true,
      json: async () => (url.includes('AvailableCountries') ? mockCountries : [malformedHoliday]),
    }));
    render(
      <HolidaysModal
        isOpen
        year={2027}
        onClose={vi.fn()}
        onApplyHolidays={onApplyHolidays}
      />,
    );

    await screen.findByRole('option', { name: 'España (ES)' });
    await waitFor(() => {
      expect(screen.getByText(/Festivos encontrados/).textContent).toContain('(0)');
    });

    expect(screen.queryByText(/sin-fecha/)).toBeNull();
    const applyButton = screen.getByRole('button', { name: /Cargar 0 días/i });
    expect((applyButton as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(applyButton);
    expect(onApplyHolidays).not.toHaveBeenCalled();
  });

  it('conserva los festivos válidos al reemplazar si la respuesta incluye una fecha malformada', async () => {
    const onApplyHolidays = vi.fn();
    mockFetch.mockImplementation(async (url: string) => ({
      ok: true,
      json: async () => (url.includes('AvailableCountries') ? mockCountries : [malformedHoliday, validHoliday]),
    }));
    render(
      <HolidaysModal
        isOpen
        year={2027}
        onClose={vi.fn()}
        onApplyHolidays={onApplyHolidays}
      />,
    );

    await screen.findByRole('option', { name: 'España (ES)' });
    await waitFor(() => {
      expect(screen.getByText(/Festivos encontrados/).textContent).toContain('(1)');
    });
    expect(screen.queryByText(/sin-fecha/)).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'Reemplazar anteriores' }));
    fireEvent.click(screen.getByRole('button', { name: /Cargar 1 día/i }));

    expect(onApplyHolidays).toHaveBeenCalledWith(
      {
        '1-1': {
          color: '#dc2626',
          label: 'Año Nuevo',
          isHoliday: true,
        },
      },
      false,
      'España',
      1,
    );
  });
});
