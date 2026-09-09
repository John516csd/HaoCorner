import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { musicArtists, findMusicArtist } from '../app/components/vinyl-room/artists.ts';
import { collectionBoxLength, collectionEase, collectionMotion, collectionSlot, nearestPosition, COLLECTION_PREVIEW_COUNT } from '../app/components/vinyl-room/record-math.ts';
import { collectionWalkArrival, collectionWalkEntries, collectionWalkPose, collectionWalkStops, WALK_ROWS } from '../app/components/vinyl-room/collection-walk-layout.ts';

const ids = new Set();
for (const artist of musicArtists) {
  assert.match(artist.id, /^[a-z][a-z0-9-]*$/);
  assert.ok(!ids.has(artist.id) && !['music', 'admin', 'api', 'rss', 'og'].includes(artist.id), 'Artist routes must be unique and unreserved');
  ids.add(artist.id);
  assert.equal(findMusicArtist(artist.id), artist);
  assert.ok(artist.albums.length > 0 && artist.name && artist.english);
  assert.equal(new Set(artist.albums.map(album => album.id)).size, artist.albums.length);
  for (const [index, album] of artist.albums.entries()) {
    assert.ok(index === 0 || album.year >= artist.albums[index - 1].year, 'Albums are chronological');
    assert.ok(album.artist);
    assert.equal(album.songCount, album.tracks.length);
    assert.equal(album.totalSongTimeMillis, album.tracks.reduce((sum, track) => sum + track.trackTimeMillis, 0));
    assert.equal(new Set(album.tracks.map(track => track.trackId)).size, album.tracks.length);
    assert.ok(album.songCount > 0, `Empty album: ${artist.id}/${album.id}`);
    const albumUrl = new URL(album.musicUrl);
    assert.equal(albumUrl.protocol, 'https:');
    assert.ok(['music.apple.com', 'open.spotify.com', 'musicbrainz.org'].includes(albumUrl.hostname));
    for (const track of album.tracks) {
      assert.ok(track.trackId > 0 && track.trackName && track.trackTimeMillis > 0);
      if (track.musicUrl) {
        const url = new URL(track.musicUrl);
        assert.equal(url.hostname, 'music.apple.com');
        // Eason retains Hong Kong track IDs alongside verified China replacement links.
        if (artist.id !== 'eason') assert.equal(Number(url.searchParams.get('i') || url.pathname.split('/').at(-1)), track.trackId);
      }
    }
  }
  for (const path of [artist.cover, ...(artist.sticker ? [artist.sticker] : []), ...artist.albums.flatMap(album => [album.artwork, album.background, album.thumbnail])]) {
    assert.ok(path, 'Complete catalogs require compact cover thumbnails');
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `Missing asset: ${path}`);
  }
}
assert.equal(findMusicArtist(null), undefined);
assert.equal(findMusicArtist('not-an-artist'), undefined);
assert.ok(collectionBoxLength(12) > collectionBoxLength(9));
for (let n = 1; n < COLLECTION_PREVIEW_COUNT; n++) assert.ok(collectionBoxLength(n + 1) > collectionBoxLength(n));
assert.equal(collectionBoxLength(100), collectionBoxLength(12), 'Full catalogs never stretch the carton');
assert.equal(collectionBoxLength(0), collectionBoxLength(1));
for (const count of [1, 9, 12, 33, 75, 83, 100]) {
  for (const position of [-23.6, 0, 4, 28.3, 82]) {
    const capacity = Math.min(count, COLLECTION_PREVIEW_COUNT);
    const visible = Array.from({ length: count }, (_, i) => i).filter(i => collectionSlot(i, position, count, capacity) < capacity);
    assert.equal(visible.length, capacity, 'Box previews are capped without trimming the catalog');
    assert.equal(new Set(visible.map(i => collectionSlot(i, position, count, capacity))).size, capacity);
    for (let i = 0; i < count; i++) {
      if (Math.abs(nearestPosition(position, i, count) - position) < 6) assert.ok(visible.includes(i), 'Every visible shelf record has a continuous path out of the box');
    }
  }
}
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
const walkEntries = collectionWalkEntries(musicArtists.map(artist => artist.id));
const rows = Math.max(WALK_ROWS, Math.ceil(musicArtists.length / 2));
assert.equal(walkEntries.length, rows * 2, 'Every artist has a collection slot');
// Reviewed release counts in music-artists/SOURCES.md; prevent silently reverting to a four-album selection.
for (const [id, count] of Object.entries({ eason: 75, mayday: 33, gem: 19, 'the-weeknd': 28, 'kanye-west': 28, 'post-malone': 16, 'charlie-puth': 17, 'justin-bieber': 37, 'taylor-swift': 83, 'jay-chou': 29 })) {
  assert.ok(findMusicArtist(id)?.albums.length >= count, `Incomplete catalog: ${id}`);
}
musicArtists.forEach(artist => assert.ok(walkEntries.some(entry => entry.artistId === artist.id)));
assert.equal(new Set(walkEntries.map(entry => entry.id)).size, walkEntries.length);
for (const count of [1, 3, 9]) {
  const ids = Array.from({ length: count }, (_, i) => `artist-${i}`);
  const entries = collectionWalkEntries(ids);
  assert.equal(new Set(entries.map(entry => `${entry.row}:${entry.column}`)).size, entries.length, 'Additional artists never overlap existing slots');
  ids.forEach(id => assert.ok(entries.some(entry => entry.artistId === id)));
}
for (const [width, height] of [[320, 568], [390, 664], [626, 1328], [1280, 720], [2560, 1320]]) {
  for (const { row, column } of walkEntries) {
    const arrival = collectionWalkPose(row, column, collectionWalkArrival(row, column, width, rows), width, height, rows);
    const start = collectionWalkPose(0, 0, 0, width, height);
    assert.ok(Math.abs(arrival.distance) <= 85, 'Every box, including the final right-hand box, reaches the foreground');
    assert.equal(arrival.scale, start.scale, 'All boxes have a consistent physical size');
    assert.ok(Number.isFinite(arrival.screenX) && Number.isFinite(arrival.screenY));
    if (row > 0) {
      const distant = collectionWalkPose(row, 0, 0, width, height);
      assert.ok(arrival.perspective > distant.perspective, 'Boxes grow as the camera approaches');
      assert.ok(arrival.screenY > distant.screenY, 'Distant boxes move down toward the viewer');
    }
    if (width < 760) {
      assert.ok(arrival.artWidth >= width * .8, 'Mobile gives the foreground box most of the screen width');
      assert.ok(arrival.screenX - arrival.artWidth / 2 >= 0 && arrival.screenX + arrival.artWidth / 2 <= width, 'Both alternating foreground boxes fit within a narrow viewport');
    }
  }
  const first = collectionWalkPose(0, 0, 0, width, height);
  const second = collectionWalkPose(0, 1, 0, width, height);
  assert.equal(collectionWalkStops(width, rows), width < 760 ? walkEntries.length : rows);
  if (width < 760) {
    assert.ok(second.screenY + second.artHeight * second.perspective / 2 < first.screenY, 'The next mobile box is distinctly farther away');
    assert.ok(second.perspective < first.perspective * .6, 'Mobile boxes alternate in depth instead of sitting side by side');
  } else {
    assert.ok(Math.abs(first.distance - second.distance) < 100, 'Desktop keeps the paired arrangement');
  }
  assert.deepEqual(collectionWalkPose(0, 0, -1, width, height), collectionWalkPose(0, 0, 0, width, height));
  assert.deepEqual(collectionWalkPose(3, 1, 2, width, height), collectionWalkPose(3, 1, 1, width, height));
  assert.equal(collectionWalkPose(0, 0, 1, width, height).visible, false, 'Passed boxes are culled before the camera');
}
console.log(`PASS: ${musicArtists.length} artists, compressed cascade, curved travel, soft landing, circular packing and carton clearance.`);
