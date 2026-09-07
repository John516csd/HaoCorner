import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loopIndex, nearestPosition } from '../app/components/vinyl-room/record-math.ts';

const albums = JSON.parse(readFileSync(new URL('../app/modules/mayday-page/albums.json', import.meta.url)));
assert.equal(albums.length, 9);
assert.equal(new Set(albums.map(album => album.id)).size, 9);
assert.equal(albums.flatMap(album => album.tracks).length, 116);
for (const [index, album] of albums.entries()) {
  assert.equal(album.artist, '五月天');
  assert.ok(index === 0 || album.year >= albums[index - 1].year);
  assert.ok(existsSync(new URL(`../public${album.artwork}`, import.meta.url)));
  assert.ok(existsSync(new URL(`../public${album.background}`, import.meta.url)));
  assert.equal(new URL(album.sourceUrl).hostname, 'coverbox.henry-hu.com');
  assert.match(album.musicUrl, /^https:\/\/music\.apple\.com\/cn\/album\/[^/]+\/\d+$/);
  assert.equal(Number(album.musicUrl.split('/').at(-1)), album.collectionId);
  assert.equal(album.songCount, album.tracks.length);
  assert.equal(album.sourceTrackCount, album.songCount);
  assert.equal(album.totalSongTimeMillis, album.tracks.reduce((total, track) => total + track.trackTimeMillis, 0));
  // Apple's original for this release is smaller; never enlarge it to claim higher resolution.
  assert.deepEqual([album.width, album.height], album.id === 'gods-children' ? [764, 839] : [1200, 1200]);
  const ids = new Set();
  for (const track of album.tracks) {
    assert.ok(!ids.has(track.trackId)); ids.add(track.trackId);
    assert.ok(track.trackTimeMillis > 0);
    assert.match(track.musicUrl, /^https:\/\/music\.apple\.com\/cn\/song\/[^/]+\/\d+$/);
    assert.equal(Number(track.musicUrl.split('/').at(-1)), track.trackId);
    assert.equal(new URL(track.trackViewUrl).searchParams.get('i'), String(track.trackId));
  }
}
// Nine sleeves must wrap correctly in both directions, independently of Eason's twelve.
for (const position of [-1000.3, -9, -0.4, 0, 4.7, 8.9, 1200.3]) {
  for (let index = 0; index < albums.length; index++) {
    const target = nearestPosition(position, index, albums.length);
    assert.ok(Math.abs(target - position) <= albums.length / 2);
    assert.ok(Math.abs(loopIndex(target, albums.length) - index) < 1e-9);
  }
}
console.log('PASS: 9 Mayday albums, 116 China song links, local covers, chronological order, and nine-record circular selection.');
