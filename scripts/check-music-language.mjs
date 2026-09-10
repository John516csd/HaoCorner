import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { english, translate, messageKey, isMusicLocale, artistDisplayName } from '../app/components/vinyl-room/messages.ts';

test('English copy resolves every placeholder, including export instructions', () => {
  const values = { artist: 'Mayday', album: '自传', track: '最好的一天', count: 2, missing: 3, max: 140, retry: 1, number: '02' };
  for (const key of Object.keys(english)) {
    assert.ok(translate('en', key, values).trim());
    assert.doesNotMatch(translate('en', key, values), /\{\w+\}/, key);
    assert.doesNotMatch(translate('zh', key, values), /\{\w+\}/, key);
  }
  assert.equal(translate('en', '保存顺序.txt'), 'image-order.txt');
});

test('Counts use singular English and preserve Chinese units', () => {
  assert.equal(translate('en', '{count} 张专辑', { count: 1 }), '1 album');
  assert.equal(translate('en', '{count} 首歌曲', { count: 2 }), '2 tracks');
  assert.equal(translate('zh', '{count} 张专辑', { count: 1 }), '1 张专辑');
});

test('Catalog availability notes all have English translations', () => {
  const catalog = JSON.parse(readFileSync(new URL('../app/modules/music-artists/albums.json', import.meta.url)));
  for (const album of Object.values(catalog).flat()) {
    if (album.musicNote) assert.ok(Object.hasOwn(english, album.musicNote), album.musicNote);
  }
});

test('Service and export errors remain translatable after language changes', () => {
  const key = messageKey(new Error('封面未加载完成，请重试。'), '生成失败，请重试。');
  assert.match(translate('en', key), /cover/);
  assert.equal(translate('zh', key), '封面未加载完成，请重试。');
  assert.equal(messageKey(new Error('Unknown service error'), '歌词加载失败，请重试。'), '歌词加载失败，请重试。');
});

test('Only supported preferences are accepted; track text is preserved literally', () => {
  for (const value of [null, undefined, '', 'fr', 'EN']) assert.equal(isMusicLocale(value), false);
  for (const value of ['en', 'zh']) assert.equal(isMusicLocale(value), true);
  assert.equal(artistDisplayName({ name: '陈奕迅', english: 'EASON CHAN' }, 'en'), 'Eason Chan');
  assert.equal(artistDisplayName({ name: '邓紫棋', english: 'G.E.M.' }, 'en'), 'G.E.M.');
  assert.equal(translate('en', '选择 {track} 的歌词', { track: '你好 $& {artist}' }), 'Choose lyrics from 你好 $& {artist}');
});
