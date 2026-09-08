import { cubicBezier } from 'motion';

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
export const collectionBoxLength = (count: number) => 1.25 + Math.min(36, Math.max(1, count)) * .075;
export const collectionEase = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };

// Pack in the shelf's circular order so no sleeve has to cross the whole stack.
export const collectionSlot = (index: number, position: number, count: number) =>
  loopIndex(index - Math.floor(position - count / 2) - 1, count);

const clampProgress = (value: number) => Math.max(0, Math.min(1, value));
const turnCurve = cubicBezier(.77, 0, .175, 1);
const releaseCurve = cubicBezier(.32, .72, 0, 1);
const settleCurve = cubicBezier(.23, 1, .32, 1);

export function collectionMotion(progress: number, slot = 0, count = 1) {
  const rank = slot / Math.max(1, count - 1);
  // A leading sleeve pulls the rest along: intervals compress and later CDs catch up.
  const departure = (progress - .30 - .22 * Math.pow(rank, .72)) / (.59 - .11 * rank);
  const spread = settleCurve(clampProgress((departure - .19) / .81));
  return {
    turn: turnCurve(clampProgress(progress / .40)),
    retreat: releaseCurve(clampProgress((progress - .32) / .20)),
    fade: settleCurve(clampProgress((progress - .65) / .20)),
    extract: releaseCurve(clampProgress(departure / .24)),
    spread,
    arc: 1.7 * Math.sin(Math.PI * spread) * (1 - spread),
  };
}
