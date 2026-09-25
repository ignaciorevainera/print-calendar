import { DayNumberPosition } from '../types';

export const OPPOSITE_POSITIONS: Record<DayNumberPosition, DayNumberPosition> = {
  'top-left': 'bottom-right',
  'top-center': 'bottom-center',
  'top-right': 'bottom-left',
  'middle-left': 'middle-right',
  center: 'bottom-right',
  'middle-right': 'middle-left',
  'bottom-left': 'top-right',
  'bottom-center': 'top-center',
  'bottom-right': 'top-left',
};

export const MIDDLE_POSITIONS: DayNumberPosition[] = ['middle-left', 'center', 'middle-right'];

export const isMiddleRow = (pos: DayNumberPosition): boolean => MIDDLE_POSITIONS.includes(pos);
