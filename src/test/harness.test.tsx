import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function Probe() {
  return <span>entorno-ok</span>;
}

describe('entorno de pruebas', () => {
  it('renderiza componentes React sobre jsdom', () => {
    render(<Probe />);
    expect(screen.getByText('entorno-ok')).toBeTruthy();
  });
});
