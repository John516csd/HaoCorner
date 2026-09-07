import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loopIndex, nearestPosition, durationLabel } from '../app/modules/eason-page/vinyl-room/record-math.ts';

const albums = JSON.parse(readFileSync(new URL('../app/modules/eason-page/vinyl-room/albums.json', import.meta.url)));
assert.equal(albums.length, 12);
assert.equal(new Set(albums.map(album => album.id)).size, 12);
for (const album of albums) {
  assert.ok(existsSync(new URL(`../public${album.artwork}`, import.meta.url)), album.artwork);
  assert.equal(new URL(album.sourceUrl).hostname, 'coverbox.henry-hu.com');
}
assert.equal(loopIndex(-1, 12), 11);
assert.equal(loopIndex(24, 12), 0);
assert.equal(nearestPosition(11, 0, 12), 12);
assert.equal(nearestPosition(0, 11, 12), -1);
for (const position of [-1000.3, -12, -0.4, 0, 4.7, 11.9, 1200.3]) {
  for (let i = 0; i < 12; i++) {
    const target = nearestPosition(position, i, 12);
    assert.ok(Math.abs(target - position) <= 6);
    assert.ok(Math.abs(loopIndex(target, 12) - i) < 1e-9);
  }
}
// A horizontal sleeve has a wider near edge. Its face reverses around the eye line.
const perspective = 1050, halfSize = 220;
const projectY = (y, z) => y * perspective / (perspective - z);
assert.ok(projectY(-200, halfSize) < projectY(-200, -halfSize));
assert.ok(projectY(200, halfSize) > projectY(200, -halfSize));
assert.equal(projectY(0, halfSize), 0);
assert.equal(durationLabel(0), '0:00');
assert.equal(durationLabel(244253), '4:04');
assert.equal(durationLabel(-1), '—');
assert.equal(durationLabel(NaN), '—');
let songs = 0, directLinks = 0;
for (const album of albums) {
  assert.ok(album.width >= 850 && album.height >= 850, `Insufficient cover resolution: ${album.id}`);
  assert.ok(existsSync(new URL(`../public${album.background}`, import.meta.url)));
  assert.equal(album.songCount, album.tracks.length);
  assert.equal(album.sourceTrackCount, album.songCount + album.excludedNonSongs.length + album.unreturnedItemCount);
  const ids = new Set();
  assert.match(album.musicUrl, /^https:\/\/music\.apple\.com\/cn\/album\/[^?]+\/\d+$/);
  for (const track of album.tracks) {
    assert.ok(!ids.has(track.trackId)); ids.add(track.trackId);
    assert.ok(track.trackTimeMillis > 0);
    assert.equal(new URL(track.trackViewUrl).hostname, 'music.apple.com');
    if (track.musicUrl) {
      const url = new URL(track.musicUrl);
      assert.equal(url.origin, 'https://music.apple.com');
      assert.match(url.pathname, /^\/cn\/song\/[^/]+\/\d+$/);
      assert.equal(url.search, '');
      if (album.id !== 'ren-le-ba') assert.equal(Number(url.pathname.split('/').at(-1)), track.trackId);
      directLinks++;
    } else {
      assert.equal(track.trackId, 1443711514, 'Only 六月飛霜 has no verified China storefront link.');
      assert.ok(album.musicNote);
    }
  }
  songs += album.tracks.length;
}
assert.equal(songs, 119);
assert.equal(directLinks, 118);
assert.ok(albums.find(album => album.id === 'ren-le-ba').musicNote.includes('台湾版'));
console.log('PASS: 12 HD covers, 119 tracks, 118 China song links, explicit availability, circular selection, duration formatting, and perspective.');
