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

export function releaseVelocity(previous: number, distance: number, elapsed: number): number {
  const next = distance / Math.max(8, elapsed);
  const speed = elapsed < 80 && previous * next > 0 ? previous * .35 + next * .65 : next;
  return Math.max(-.018, Math.min(.018, speed));
}

export function coast(velocity: number, elapsed: number) {
  const friction = 220;
  const decay = Math.exp(-elapsed / friction);
  return { distance: velocity * friction * (1 - decay), velocity: velocity * decay };
}
