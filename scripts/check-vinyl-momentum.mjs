// node --experimental-strip-types scripts/check-vinyl-momentum.mjs
import assert from 'node:assert/strict';
import { coast, releaseVelocity } from '../app/components/vinyl-room/record-math.ts';

const fast = releaseVelocity(0, 1, 16);
const slow = releaseVelocity(0, 1, 120);
assert.ok(fast > slow, 'A fast flick should coast farther than the same slow drag');
assert.ok(releaseVelocity(fast, -.1, 16) < 0, 'Reversing input should immediately reverse velocity');
assert.equal(releaseVelocity(fast, 0, 120), 0, 'Pausing before release should remove momentum');
assert.ok(Number.isFinite(releaseVelocity(0, 1, 0)), 'Coalesced event timestamps should stay finite');
assert.ok(releaseVelocity(0, 10000, 8) <= .018, 'Extreme input should have a bounded release speed');
let tail = fast;
for (const distance of [.3, .15, .07, .02, .005, .001]) tail = releaseVelocity(tail, distance, 16);
assert.ok(tail < fast / 20, 'Native trackpad tails must reduce additional coast');

const travel = (hz, initialVelocity = fast) => {
  let velocity = initialVelocity, distance = 0;
  for (let frame = 0; frame < hz; frame++) {
    const next = coast(velocity, 1000 / hz);
    assert.ok(Math.abs(next.velocity) <= Math.abs(velocity), 'Momentum should decay every frame');
    velocity = next.velocity; distance += next.distance;
  }
  return distance;
};
assert.ok(travel(60) > travel(60, slow));
assert.ok(Math.abs(travel(30) - travel(120)) < 1e-10, 'Travel should not depend on frame rate');
assert.ok(Math.abs(travel(60, -fast) + travel(60)) < 1e-10, 'Both directions should behave identically');
assert.deepEqual(coast(0, 16), { distance: 0, velocity: 0 });
assert.ok(coast(fast, 1000).velocity < .00035, 'Strong flicks should settle within about a second');
console.log('PASS: flick strength, reversal, stale releases, native tails, bounded speed, and frame-rate independent friction.');
