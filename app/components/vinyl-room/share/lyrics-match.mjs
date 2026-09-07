import { Converter } from 'opencc-js';

const simplify = Converter({ from: 'tw', to: 'cn' });
export const traditional = Converter({ from: 'cn', to: 'tw' });
const normalize = value => simplify(value).toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
const artistKey = value => ['easonchan', '陈奕迅'].includes(normalize(value)) ? '陈奕迅' : normalize(value);

// Never silently substitute a live recording or another artist's song.
export function matchLyrics(records, album, track) {
  return records.filter(record => record && typeof record.trackName === 'string' && typeof record.artistName === 'string'
    && typeof record.albumName === 'string' && Number.isFinite(record.duration)
    && typeof record.plainLyrics === 'string' && record.plainLyrics.trim() && record.plainLyrics.length <= 30000
    && Number.isSafeInteger(record.id)
    && normalize(record.trackName) === normalize(track.trackName)
    && artistKey(record.artistName) === artistKey(album.artist))
    .map(record => ({
      id: record.id, title: record.trackName, artist: record.artistName, album: record.albumName,
      duration: record.duration, lyrics: record.plainLyrics.trim(),
      exact: [album.title, album.sourceTitle].filter(Boolean).some(title => normalize(title) === normalize(record.albumName))
        && Math.abs(record.duration - track.trackTimeMillis / 1000) <= 4,
      delta: Math.abs(record.duration - track.trackTimeMillis / 1000),
    }))
    .filter((record, index, all) => all.findIndex(item => item.id === record.id) === index)
    .sort((a, b) => Number(b.exact) - Number(a.exact) || a.delta - b.delta)
    .slice(0, 5);
}
