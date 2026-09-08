import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { musicArtists, findMusicArtist } from '../app/components/vinyl-room/artists.ts';
import { collectionBoxLength, collectionEase, collectionMotion, collectionSlot, nearestPosition } from '../app/components/vinyl-room/record-math.ts';

const ids = new Set();
for (const artist of musicArtists) {
  assert.match(artist.id, /^[a-z][a-z0-9-]*$/);
  assert.ok(!ids.has(artist.id) && !['music', 'admin', 'api', 'rss', 'og'].includes(artist.id), 'Artist routes must be unique and unreserved');
  ids.add(artist.id);
  assert.equal(findMusicArtist(artist.id), artist);
  assert.ok(artist.albums.length > 0 && artist.name && artist.english);
  for (const path of [artist.cover, ...(artist.sticker ? [artist.sticker] : []), ...artist.albums.flatMap(album => [album.artwork, album.background])]) {
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `Missing asset: ${path}`);
  }
}
assert.equal(findMusicArtist(null), undefined);
assert.equal(findMusicArtist('not-an-artist'), undefined);
assert.ok(collectionBoxLength(12) > collectionBoxLength(9));
for (let n = 1; n < 36; n++) assert.ok(collectionBoxLength(n + 1) > collectionBoxLength(n));
assert.equal(collectionBoxLength(100), collectionBoxLength(36));
assert.equal(collectionBoxLength(0), collectionBoxLength(1));
assert.equal(collectionEase(-1), 0);
assert.equal(collectionEase(2), 1);
for (let i = 0; i <= 100; i++) {
  const progress = i / 100;
  assert.ok(collectionEase(progress) >= collectionEase(progress - .01));
  assert.ok(Math.abs(collectionEase(progress) + collectionEase(1 - progress) - 1) < 1e-12, 'Opening and return must follow the same path');
}
for (const count of [1, 9, 12, 36]) {
  for (const position of [-23.6, -.6, 0, .49, .51, 4, 4.9, 28.3]) {
    const ordered = Array.from({length: count}, (_, i) => i).sort((a, b) => collectionSlot(a, position, count) - collectionSlot(b, position, count));
    assert.equal(new Set(ordered.map(i => collectionSlot(i, position, count))).size, count);
    for (let i = 1; i < count; i++) assert.ok(nearestPosition(position, ordered[i], count) > nearestPosition(position, ordered[i - 1], count), 'Packed order must match the shelf even across wraparound');
  }
  for (let frame = 0; frame <= 200; frame++) {
    const progress = frame / 200;
    let previous = 1;
    for (let slot = 0; slot < count; slot++) {
      const motion = collectionMotion(progress, slot, count);
      assert.ok(motion.extract <= previous, 'Discs leave top to bottom'); previous = motion.extract;
      if (motion.fade > 0) assert.equal(motion.extract, 1, 'Every CD must clear before the box fades');
      assert.ok(motion.arc >= 0 && motion.arc <= 1, 'The sweep is shallow and never oscillates');
      if (motion.spread > 0) {
        assert.equal(motion.turn, 1); assert.ok(motion.extract > .98, 'Blend extraction into travel once clear of the rim');
        // In the upright pose, CD depth is half its size. Check both viewport proportions.
        for (const boxScale of [.15, .24, .4]) {
          const boxZ = -1.3 * motion.retreat;
          const cdZ = (boxZ + boxScale * (.18 + 1.05 * motion.extract)) * (1 - motion.spread);
          const cdSize = boxScale * .85 * (1 - motion.spread) + motion.spread;
          assert.ok(cdZ - cdSize * .53 > boxZ + boxScale * .34, 'The curved, tilted CD must stay in front of the carton');
        }
      }
    }
  }
  assert.equal(collectionMotion(1, count - 1, count).spread, 1);
}
assert.ok(collectionMotion(.44).extract > 0, 'Departure overlaps the end of the turn without a pause');
assert.ok(collectionMotion(.6, 0, 12).spread > collectionMotion(.6, 11, 12).spread, 'Each CD has its own arrival time');
const starts = Array.from({length:12}, (_, slot) => {
  for (let frame = 0; frame <= 1000; frame++) if (collectionMotion(frame / 1000, slot, 12).extract > 0) return frame;
});
assert.ok(starts[1] - starts[0] > (starts[11] - starts[10]) * 1.5, 'Trailing CDs catch up rather than march at equal intervals');
assert.ok(collectionMotion(.54).spread - collectionMotion(.53).spread > (collectionMotion(.82).spread - collectionMotion(.81).spread) * 4, 'Release has momentum and a soft landing');
assert.equal(collectionMotion(0).arc, 0); assert.equal(collectionMotion(1).arc, 0);
console.log(`PASS: ${musicArtists.length} artists, compressed cascade, curved travel, soft landing, circular packing and carton clearance.`);
