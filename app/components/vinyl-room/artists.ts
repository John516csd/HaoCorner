import eason from '../../modules/eason-page/albums.json' with { type: 'json' };
import mayday from '../../modules/mayday-page/albums.json' with { type: 'json' };
import type { VinylAlbum } from './types';

export type MusicArtist = {
  id: string;
  name: string;
  english: string;
  albums: VinylAlbum[];
  cover: string;
  sticker?: string;
  description: string;
};

// Add an artist here: the collection, navigation, routes, sitemap and lyrics share this list.
export const musicArtists: MusicArtist[] = [
  { id: 'eason', name: '陈奕迅', english: 'EASON CHAN', albums: eason,
    cover: '/eason/covers/u87.webp', sticker: '/vinyl-room/stickers/eason-balloons.svg',
    description: '滚动翻阅陈奕迅的专辑，点击唱片查看歌曲，选择歌词，收藏那些后来才听懂的声音。' },
  { id: 'mayday', name: '五月天', english: 'MAYDAY', albums: mayday,
    cover: '/mayday/covers/gods-children.webp', sticker: '/vinyl-room/stickers/mayday-carrot.svg',
    description: '从《五月天第一张创作专辑》到《自传》，滚动翻阅五月天的专辑，展开歌曲，重温青春。' },
];

export const findMusicArtist = (id: string | null) => musicArtists.find(artist => artist.id === id);
