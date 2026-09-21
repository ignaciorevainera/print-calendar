import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';

describe('metadata.json', () => {
  it('no promete un buscador inexistente', () => {
    const raw = readFileSync(resolve(process.cwd(), 'metadata.json'), 'utf8');
    expect(raw.toLowerCase()).not.toContain('buscador');
  });

  it('es JSON válido con descripción no vacía', () => {
    const raw = readFileSync(resolve(process.cwd(), 'metadata.json'), 'utf8');
    const parsed = JSON.parse(raw) as { description?: string };
    expect(typeof parsed.description).toBe('string');
    expect((parsed.description ?? '').length).toBeGreaterThan(0);
  });
});
