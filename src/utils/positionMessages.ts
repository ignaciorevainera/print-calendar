import { DayNumberPosition } from '../types';

export const POSITION_LABELS: Record<DayNumberPosition, string> = {
  'top-left': 'Sup. Izquierda',
  'top-center': 'Sup. Centro',
  'top-right': 'Sup. Derecha',
  'middle-left': 'Centro Izquierda',
  'center': 'Centro',
  'middle-right': 'Centro Derecha',
  'bottom-left': 'Inf. Izquierda',
  'bottom-center': 'Inf. Centro',
  'bottom-right': 'Inf. Derecha',
};

export function deflectionMessage(area: 'número' | 'nota', position: DayNumberPosition): string {
  return `Posición de ${area} ajustada a ${POSITION_LABELS[position]} para evitar colisión`;
}
