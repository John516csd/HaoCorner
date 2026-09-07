export function loopIndex(value: number, length: number): number {
  return ((value % length) + length) % length;
}

export function nearestPosition(position: number, index: number, length: number): number {
  return index + Math.round((position - index) / length) * length;
}

export function durationLabel(milliseconds: number): string {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return '—';
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
